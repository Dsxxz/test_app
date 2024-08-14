import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwtConstants';
import bcrypt from 'bcrypt';
import { MailAdapter } from '../infrastructure/mail.adapter';
import { CreateUserDto } from '../users/models/users.create.dto';

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
    const payload: { username: any; sub: string } = {
      username: userPayload.login,
      sub: userPayload.id,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
      }),
    };
  }

  async emailResending(email: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }
    return this.mailService.emailResending(email);
  }

  async registrateUsingEmail(code: string) {
    const isCorrectCode = await this.usersService.checkIsCorrectCode(code);
    const isConfirmCode = await this.usersService.checkIsConfirm(code);
    if (!isCorrectCode || isConfirmCode) {
      throw new HttpException(
        'confirm code is not correct',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.usersService.updateConfirmationIsConfirmed(code);
  }

  async registrate(loginUserDTO: CreateUserDto) {
    const existUser =
      await this.usersService.checkForExistingUser(loginUserDTO);
    if (existUser) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }
    const newUser = await this.usersService.createUser(loginUserDTO);
    const regUser = await this.usersService.findOne(newUser.email);
    if (!regUser) {
      throw new Error('something went wrong while registration');
    }
    try {
      await this.usersService.registrateConfirmCode(regUser.id);
      await this.mailService.sendConfirmCode(newUser.email, regUser.email);
    } catch (e) {
      console.log(e);
    }
  }
}
