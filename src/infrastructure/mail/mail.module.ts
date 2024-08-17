import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailData } from '../constants/mail.data';
import { MailAdapter } from '../mail.adapter';
import * as dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 465,
        secure: false,
        auth: {
          user: mailData.email,
          pass: mailData.pass,
        },
      },
    }),
  ],
  providers: [MailAdapter],
})
export class MailModule {}
