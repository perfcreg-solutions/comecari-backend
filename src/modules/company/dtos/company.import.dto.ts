import { OmitType } from '@nestjs/swagger';
import { CompanyCreateDto } from './company.create.dto';

export class CompanyImportDto extends OmitType(CompanyCreateDto, [
] as const) {}