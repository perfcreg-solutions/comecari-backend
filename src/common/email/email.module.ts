import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from 'src/common/email/services/email.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('email.server'),
          port: configService.get<string>('email.port'),
          secure: false,
          auth: {
            user: configService.get<string>('email.key'),
            pass: configService.get<string>('email.key'),
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
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
