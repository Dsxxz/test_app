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
import { CreateUserDto } from '../users/models/users.create.dto';

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
    const user = await this.userService.findOne(registrateDTO.loginOrEmail);
    if (!user) {
      console.log(user);
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    const token = await this.authService.loginUser(user);
    res.cookie('accessToken', token.access_token, {
      httpOnly: true,
      secure: true,
    });
    return res.send(token);
  }
  @Post('registration')
  @HttpCode(204)
  async registrate(@Body() loginUserDTO: CreateUserDto) {
    await this.userService.createUser(loginUserDTO);
    return await this.authService.registrate(loginUserDTO);
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async verifyEmail(@Body() code: string) {
    return this.authService.registrateUsingEmail(code);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('me')
  async getUser(@CurrentUserId() currentUserId: any) {
    const user = await this.userService.findUserById(currentUserId);
    return { email: user?.email, login: user?.login, userId: user?.id };
  }

  @Post('password-recovery')
  async passwordRecovery(@Body() email: string) {
    return this.authService.passwordRecovery(email);
  }
}
