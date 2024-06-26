import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailAdapter {
  constructor(private mailService: MailerService) {}

  async sendConfirmCode(email: string, confirmationCode: string) {
    await this.mailService.sendMail({
      to: email,
      from: 'app.nest',
      subject: 'Registration confirmation',
      html:
        '<h1>Thanks for your registration</h1>\n' +
        `<p>${confirmationCode} To finish registration please follow the link below:\n` +
        `<a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a>\n` +
        '</p>',
    });
  }

  async sendPasswordRecovery(email: string, recoveryCode: string) {
    await this.mailService.sendMail({
      to: email,
      from: 'app.nest',
      subject: 'password recovery',
      html:
        `<h1>Password recovery</h1>` +
        `<p>${recoveryCode} To finish password recovery please follow the link below:\n` +
        `<a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>\n` +
        `</p>`,
    });
  }
}
