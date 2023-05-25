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

export class UserVerifyToken{
    @ApiProperty({
        example: faker.datatype.number(),
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @MinLength(6)
    @MaxLength(6)
    @ValidateIf((e) => e.mobileNumber !== '')
    @Type(() => String)
    readonly token?: string;
}
