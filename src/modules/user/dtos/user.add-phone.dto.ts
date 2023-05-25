import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
    IsNotEmpty, 
    IsString, 
    MaxLength, 
    IsOptional,
    ValidateIf, 
    MinLength } from 'class-validator';

export class UserAddPhoneNumber{
    @ApiProperty({
        example: faker.phone.number('2348034#########'),
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @MinLength(10)
    @MaxLength(14)
    @ValidateIf((e) => e.mobileNumber !== '')
    @Type(() => String)
    readonly mobileNumber?: string;
}
