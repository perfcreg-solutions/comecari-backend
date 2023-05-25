import { OmitType } from '@nestjs/swagger';
import { DriverCreateDto } from './driver.create.dto';

export class DriverUserCreateDto extends OmitType(DriverCreateDto, [
    'user',
] as const) {}
