import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailAdapter {
  constructor(private mailService: MailerService) {}

  async sendConfirmCode(email: string, confirmationCode: string) {
    await this.mailService.sendMail({
      to: email,
      from: 'test_app',
      subject: 'Registration confirmation',
      html:
        '<h1>Thanks for your registration</h1>\n' +
        `<p>${confirmationCode} To finish registration please follow the link below:\n` +
        `<a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a>\n` +
        '</p>',
    });
  }

  async emailResending(email: string) {
    await this.mailService.sendMail({
      to: email,
      from: 'test_app',
      subject: 'password recovery',
      html:
        `<h1>Password recovery</h1>` +
        `<p>${email} To finish password recovery please follow the link below:\n` +
        `<a href='https://somesite.com/password-recovery?recoveryCode=${email}'>recovery password</a>\n` +
        `</p>`,
    });
  }
}
