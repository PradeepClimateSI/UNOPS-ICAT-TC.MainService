import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

const fs = require('fs');

@Injectable()
export class EmailNotificationService {
  constructor(private readonly mailerService: MailerService) {}

  from: string = process.env.EMAIL;

  async sendMail(
    to: string,
    subject: string,
    text: string,
    emailTemplate: string = '',
  ) {
    this.mailerService
      .sendMail({
        to: to, //user.email, // list of receivers
        from: this.from, // sender address
        subject: subject, // Subject line
        text: text, // plaintext body
        html: emailTemplate, // HTML body content
      })
      .then((res) => {
      })
      .catch((e) => {
      });
  }

}
