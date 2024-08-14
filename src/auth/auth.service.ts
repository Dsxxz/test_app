import {
  BadRequestException,
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
      throw new Error('user does not exist');
    }
    return this.mailService.emailResending(email);
  }

  async registrateUsingEmail(code: string) {
    // Проверка правильности кода
    const isCorrectCode = await this.usersService.checkIsCorrectCode(code);
    // Проверка подтвержденного кода
    const isConfirmCode = await this.usersService.checkIsConfirm(code);
    // Логика обработки результата
    if (!isCorrectCode) {
      throw new BadRequestException({
        message: 'code is a wrong',
        field: 'string',
      });
    }
    if (isConfirmCode) {
      throw new BadRequestException({
        message: 'code is already confirmed',
        field: 'string',
      });
    }

    // Обновление подтверждения
    return this.usersService.updateConfirmationIsConfirmed(code);
  }

  async registrate(loginUserDTO: CreateUserDto) {
    const existUser =
      await this.usersService.checkForExistingUser(loginUserDTO);
    if (existUser) {
      throw new Error('user already exist');
    }
    const newUser = await this.usersService.createUser(loginUserDTO);
    const regUser = await this.usersService.findOne(newUser.email);
    if (!regUser) {
      throw new Error('something went wrong while registration');
    }
    try {
      await this.usersService.registrateConfirmCode(regUser.id);
      await this.mailService.sendConfirmCode(newUser.email, regUser.email);
      return true;
    } catch (e) {
      console.log(e);
    }
  }
}
