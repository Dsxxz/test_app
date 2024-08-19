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
import { RegistrationUserDTO } from './dto/registrationUserDTO';
import { exceptionResponseType } from '../settings/types/exception.response.type';

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
      throw new BadRequestException('user does not exist');
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException('user already confirmed');
    }
    const code = await this.usersService.generateRandomString(6);
    await this.usersService.updateConfirmationIsConfirmed(code);

    return this.mailService.emailResending(user.email, code);
  }

  async registrateUsingEmail(code: string) {
    // Проверка правильности кода
    const isCorrectCode = await this.usersService.checkIsCorrectCode(code);
    // Проверка подтвержденного кода
    const isConfirmCode = await this.usersService.checkIsConfirm(code);
    // Логика обработки результата
    if (!isCorrectCode) {
      throw new BadRequestException({
        errorsMessages: [
          { message: 'code is already confirmed', field: 'code' },
        ],
      } as exceptionResponseType);
    }
    if (isConfirmCode) {
      throw new BadRequestException({
        errorsMessages: [
          { message: 'code is already confirmed', field: 'code' },
        ],
      } as exceptionResponseType);
    }

    // Обновление подтверждения
    return this.usersService.updateConfirmationIsConfirmed(code);
  }

  async registrate(loginUserDTO: RegistrationUserDTO) {
    const newUser = await this.usersService.createUser(loginUserDTO);
    if (!newUser) {
      throw new Error('something went wrong when creating user');
    }
    try {
      const mail = await this.mailService.sendConfirmCode(
        newUser.email,
        newUser.email,
      );
      if (!mail) {
        return this.usersService.deleteUserById(newUser.id);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
