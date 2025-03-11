import { AuthService } from "../features/auth/infrastructure/auth.service";
import { JwtStrategy } from "../core/strategies/jwt.strategy";
import { LocalStrategy } from "../core/strategies/local.strategy";
import { MailAdapter } from "../infrastructure/mail.adapter";
import { BasicStrategy } from "../core/strategies/basic.strategy";
import { IsUserAlreadyExistConstraint } from "../core/decorators/unique.login.decorator";
import { IsEmailExistConstraint } from "../core/decorators/unique.email.decorator";
import { IsCodeAlreadyConfirmed } from "../core/decorators/confirmation.code.decorator";
import { IsEmailAlreadyConfirmed } from "../core/decorators/confirmation.email.decorator";
import { BearerStrategy } from "../core/strategies/bearer.strategy";
import { UsersService } from "../features/users/application/users.service";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../features/users/infrastructure/users.repository";
import { IsEmailAlreadyRegistered } from "../core/decorators/recovery.email.code.decorator";

export const authExports = [
  AuthService,
  JwtStrategy,
  LocalStrategy,
  MailAdapter,
  BasicStrategy,
  IsUserAlreadyExistConstraint,
  IsEmailExistConstraint,
  IsCodeAlreadyConfirmed,
  IsEmailAlreadyConfirmed,
  IsEmailAlreadyRegistered,
  BearerStrategy,
  UsersService,
  JwtService,
  UsersRepository,
];
