import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILHOG_HOST ?? 'localhost',
      port: Number(process.env.MAILHOG_PORT ?? 1025),
      secure: false,
    }) as nodemailer.Transporter;
  }

  async sendPaymentToken(
    email: string,
    token: string,
    sessionId: number,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: '"Wallet App" <no-reply@wallet.local>',
      to: email,
      subject: 'Confirm your payment',
      text: `Your confirmation token is: ${token}. Session ID: ${sessionId}`,
      html: `<p>Your confirmation token is: <b>${token}</b></p><p>Session ID: ${sessionId}</p>`,
    });
  }
}
