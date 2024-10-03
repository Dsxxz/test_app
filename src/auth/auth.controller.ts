import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  HttpStatus,
  HttpCode,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthLoginDto } from './dto/create-auth-login-dto';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { CurrentUserId } from '../helpers/user.decorator';
import { VerifyEmailDto } from '../users/models/users.create.dto';
import { RegistrationUserDTO } from './dto/registration-user-DTO';
import { RegistrationEmailDTO } from './dto/registration-email-DTO';
import { BearerAuthGuard } from './guards/bearer.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  @Post('login')
  @HttpCode(200)
  async registrateUser(
    @Body() registrateDTO: CreateAuthLoginDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.loginUser(registrateDTO);
    if (!user) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    const tokens = await this.authService.loginUser(user);
    res.cookie(tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.send(tokens.accessToken);
  }
  @Post('registration')
  @HttpCode(204)
  async registrate(@Body() loginUserDTO: RegistrationUserDTO) {
    return this.authService.registrate(loginUserDTO);
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.registrateUsingEmail(verifyEmailDto.code);
  }

  @UseGuards(BearerAuthGuard)
  @HttpCode(200)
  @Get('me')
  async getUser(@CurrentUserId() currentUserId: any) {
    const user = await this.userService.findUserById(currentUserId);
    return { email: user?.email, login: user?.login, userId: user?.id };
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async emailResending(@Body() email_Auth_DTO: RegistrationEmailDTO) {
    return this.authService.emailResending(email_Auth_DTO.email);
  }
}
