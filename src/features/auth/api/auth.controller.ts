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
import { AuthService } from '../infrastructure/auth.service';
import { CreateAuthLoginDto } from '../dto/create-auth-login-dto';
import { Response } from 'express';
import { CurrentUserId } from '../../../core/decorators/currentUserIdFromHeaders.decorator';
import { RegistrationUserDTO } from '../dto/registration-user-DTO';
import { PasswordRecoveryEmailDTO, RegistrationEmailDTO } from "../dto/registration-email-DTO";
import { BearerAuthGuard } from '../../../core/guards/bearer.guard';
import { UsersService } from '../../users/application/users.service';
import { VerifyEmailDto } from '../../users/api/input-dto/input-user-dto';

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
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.send({ accessToken: tokens.accessToken });
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
    console.log('currentUserId/me', currentUserId);
    //todo: pay attention to this currentUserId, there is object {id: string}
    return { email: user?.email, login: user?.login, userId: currentUserId.id };
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async emailResending(@Body() email_Auth_DTO: RegistrationEmailDTO) {
    return this.authService.emailResending(email_Auth_DTO.email);
  }
  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body() passwordRecoveryEmailDTO: PasswordRecoveryEmailDTO) {
    return this.authService.passwordRecovery(passwordRecoveryEmailDTO.email);
  }

  @Post('new-password')
  @HttpCode(204)
  async confirmNewPassword(@Body() dto:{
    "newPassword": string,
    "recoveryCode": string
  }){
    return this.authService.confirmNewPassword(dto);
  }
}
