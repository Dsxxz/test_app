import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { jwtConstants } from './constants/jwtConstants';
import { MailAdapter } from '../infrastructure/mail.adapter';
import { BasicStrategy } from './strategies/basic.strategy';
import { ConfigModule } from '@nestjs/config';
import { IsUserAlreadyExistConstraint } from '../validation/unique.login.decorator';
import { IsEmailExistConstraint } from '../validation/unique.email.decorator';
import { IsCodeAlreadyConfirmed } from '../validation/confirmation.code.decorator';
import { IsEmailAlreadyConfirmed } from '../validation/confirmation.email.decorator';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({
      secret: '' + jwtConstants.secret,
      signOptions: { expiresIn: '5min' },
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    MailAdapter,
    BasicStrategy,
    IsUserAlreadyExistConstraint,
    IsEmailExistConstraint,
    IsCodeAlreadyConfirmed,
    IsEmailAlreadyConfirmed,
  ],
})
export class AuthModule {}
