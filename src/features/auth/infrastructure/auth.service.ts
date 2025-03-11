import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants/jwtConstants';
import bcrypt from 'bcrypt';
import { MailAdapter } from '../../../infrastructure/mail.adapter';
import { RegistrationUserDTO } from '../dto/registration-user-DTO';
import { ObjectId } from 'mongodb';
import { UsersService } from '../../users/application/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailAdapter,
  ) {}

  async validate(payload: {
    username: string;
    password: string;
  }): Promise<any> {
    const user = await this.usersService.findOne(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordMatch = await bcrypt.compare(
      payload.password,
      user.userPasswordHash,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async loginUser(userPayload: any) {
    const payload: { username: string; sub: string } = {
      username: userPayload.login,
      sub: userPayload.id,
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: '24h',
    });
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: '5m',
    });
    return { refreshToken, accessToken };
  }

  async emailResending(email: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new BadRequestException('user does not exist');
    }
    const code = await this.usersService.registrateConfirmCode(user._id);
    return this.mailService.emailResending(user.email, code);
  }

  async registrateUsingEmail(code: string) {
    return this.usersService.updateConfirmationIsConfirmed(code);
  }

  async registrate(loginUserDTO: RegistrationUserDTO) {
    const newUser = await this.usersService.createUser(loginUserDTO);
    if (!newUser) {
      throw new Error('something went wrong when creating user');
    }
    try {
      const id = new ObjectId(newUser.id.toString())
      const code = await this.usersService.registrateConfirmCode(id);
      const mail = await this.mailService.sendConfirmCode(newUser.email, code);
      if (!mail) {
        return this.usersService.deleteUserById(newUser.id);
      }
      return true;
    } catch (e) {
      console.log(e);
    }
  }

  async passwordRecovery(email: string) {
    try{
      const user = await this.usersService.findOne(email);
      if(!user){
        console.log(`Email doesn't registered`);
        return true;
      }
      user!.emailConfirmation.isConfirmed = false;
      await user!.save();
      console.log(user);
      const code = await this.usersService.registrateConfirmCode(user!._id);
      //TODO: check this method (updateConfirmationEmailInfo).
     return this.mailService.sendConfirmCode(email, code);
    }
    catch (e){
      console.log(e);
      return false;
    }
  }

  async confirmNewPassword(dto: { newPassword: string; recoveryCode: string }) {
    const user = await this.usersService.findUserByCode(dto.recoveryCode);
    if(!user){
      return false;
    }
    //TODO: change this DTO;
    const checkOldPassword = await this.usersService.checkOldPassword(dto.newPassword, user._id);
    if(checkOldPassword){
      return false;
    }
    try{
      await this.usersService.updatePasswordData(dto, user._id);
      return true
    }
    catch (e) {
      console.log(e);
      return false;
    }

  }
}
