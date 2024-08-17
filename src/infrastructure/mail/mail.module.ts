import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailData } from '../constants/mail.data';
import { MailAdapter } from '../mail.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
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
