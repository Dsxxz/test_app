import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwtConstants';
import { ConfigModule } from '@nestjs/config';
import { authProviders } from '../../unsorted/authModule.providers';
import { authExports } from '../../unsorted/authModule.exports';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from '../users/domain/users.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    PassportModule,
    ConfigModule,
    JwtModule.register({
      secret: '' + jwtConstants.secret,
      signOptions: { expiresIn: '50min' },
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: authProviders,
  exports: authExports,
})
export class AuthModule {}
