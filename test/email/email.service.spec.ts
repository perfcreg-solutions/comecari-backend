import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailDto } from 'src/common/email/dtos/send-email.dto';
import { EmailService } from 'src/common/email/services/email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

describe('EmailService', () => {
  let service: EmailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService, 
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'product.name':
                  return 'comecari';
                case 'product.url':
                  return 'comecari.com';
                case 'product.company':
                  return 'Comecari Nigeria';
                case 'product.address':
                  return 'Nigeria';
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should send an email', async () => {
      const sendEmailSpy = jest.spyOn(mailerService, 'sendMail');

      const sendEmailDto: SendEmailDto = {
        to: 'info@perfcreg.org',
        subject: 'Welcome',
        template: 'welcome.hbs',
        context: {
          name: "femi",
        },
      };

      await service.sendEmail(sendEmailDto);

      expect(sendEmailSpy).toHaveBeenCalled();
    //   expect(sendEmailSpy).toHaveBeenCalledWith(sendEmailDto);

      sendEmailSpy.mockRestore();
    });
  });
});
