import { SendEmailDto } from 'src/common/email/dtos/send-email.dto';

export interface EmailServiceInterface {
  sendEmail(sendEmailDto: SendEmailDto): Promise<void>;
}
