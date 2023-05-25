import { Inject } from '@nestjs/common';
import { EMAIL_SERVICE } from 'src/common/email/constants/email.constants';

export const InjectEmailService = () => Inject(EMAIL_SERVICE);
