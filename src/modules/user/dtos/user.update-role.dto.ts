import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
    IsNotEmpty, 
    IsString, 
    MaxLength, 
    IsOptional,
    ValidateIf, 
    MinLength, 
    IsUUID} from 'class-validator';

export class UserUpdateRoleDto{
    @ApiProperty({
        example: faker.datatype.uuid(),
        required: true,
    })
    @IsNotEmpty()
    @IsUUID('4')
    readonly role: string;
}
