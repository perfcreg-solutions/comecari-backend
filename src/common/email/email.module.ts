import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from 'src/common/email/services/email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_SERVER,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_KEY,
          pass: process.env.EMAIL_KEY
        },
      },
      defaults: {
        from: '"Comecari" <noreply@comecari.com>',
    },
    template: {
      dir: '',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
],
providers: [EmailService],
exports: [EmailService],
})
export class EmailModule {}
