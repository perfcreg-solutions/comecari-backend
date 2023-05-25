import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsUUID,
} from 'class-validator';

export class CompanyCreateDto {
    @ApiProperty({
        example: faker.company.name(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @Type(() => String)
    readonly companyName: string;

    @ApiProperty({
        example: faker.company.catchPhraseDescriptor(),
        required: false,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    @Type(() => String)
    readonly companyDescription: string;

    @ApiProperty({
        example: faker.address.streetAddress(),
        required: false,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    @Type(() => String)
    readonly companyAddress: string;

    @ApiProperty({
        example: faker.datatype.uuid(),
        required: true,
    })
    @IsNotEmpty()
    @IsUUID('4')
    readonly user: string;
}
