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
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { CurrentUserId } from '../helpers/user.decorator';
import { VerifyEmailDto } from '../users/models/users.create.dto';
import { RegistrationUserDTO } from './dto/registrationUserDTO';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  @Post('login')
  @HttpCode(200)
  async registrateUser(
    @Body() registrateDTO: CreateAuthDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.loginUser(registrateDTO);
    if (!user) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    const token = await this.authService.loginUser(user);
    res.cookie('accessToken ', token.accessToken, {
      httpOnly: true,
      secure: true,
    });
    return res.send(token);
  }
  @Post('registration')
  @HttpCode(204)
  async registrate(@Body() loginUserDTO: RegistrationUserDTO) {
    return this.authService.registrate(loginUserDTO);
  }

  @Post('registration-confirmation')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.registrateUsingEmail(verifyEmailDto.code);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('me')
  async getUser(@CurrentUserId() currentUserId: any) {
    const user = await this.userService.findUserById(currentUserId);
    return { email: user?.email, login: user?.login, userId: user?.id };
  }

  @Post('registration-email-resending')
  async emailResending(@Body() email: string) {
    return this.authService.emailResending(email);
  }
}
