import { OmitType } from '@nestjs/swagger';
import { DriverCreateDto } from './driver.create.dto';

export class DriverLicenseDto extends OmitType(DriverCreateDto, [
    'user',
    'dateOfBirth',
    'driverLicenseExpires'
] as const) {}
