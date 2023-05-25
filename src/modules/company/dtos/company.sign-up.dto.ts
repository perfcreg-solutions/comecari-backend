import { OmitType } from '@nestjs/swagger';
import { CompanyCreateDto } from './company.create.dto';

export class CompanySignUpDto extends OmitType(CompanyCreateDto, [
    'user',
] as const) {}
