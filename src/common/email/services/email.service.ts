import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from 'src/common/email/dtos/send-email.dto';
import { EmailServiceInterface } from 'src/common/email/interfaces/email-service.interface';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class EmailService implements EmailServiceInterface {
  private readonly productName: string;
  private readonly productUrl: string;
  private readonly companyName: string;
  private readonly companyAddress: string;

  constructor(private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {
    this.productName = this.configService.get<string>('product.name');
    this.productUrl = this.configService.get<string>('product.url');
    this.companyName = this.configService.get<string>('product.company');
    this.companyAddress = this.configService.get<string>('product.address');
   }

  async sendEmail(sendEmailDto: SendEmailDto): Promise<void> {
    const product_name = this.productName
    const product_url = this.productUrl
    const company_name = this.companyName
    const company_address = this.companyAddress

    const { to, subject, template, context } = sendEmailDto;

    await this.mailerService.sendMail({
      to,
      subject,
      template: `./src/common/email/services/templates/${template}`,
      context: { ...context, product_name, product_url, company_address, company_name },
    });
  }
}