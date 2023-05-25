import { OmitType } from '@nestjs/swagger';
import { DriverCreateDto } from './driver.create.dto';

export class DriverImportDto extends OmitType(DriverCreateDto, [
] as const) {}