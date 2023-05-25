import { faker } from "@faker-js/faker";
import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";
import { AwsS3Serialization } from "src/common/aws/serializations/aws.s3.serialization";
import { UserEntity } from "src/modules/user/repository/entities/user.entity";
import { EMUM_VERIFICATION_STATUS_TYPE } from "../constants/driver.enum.constant";
import { ENUM_USER_SIGN_UP_FROM } from "src/modules/user/constants/user.enum.constant";

export class DriverCreateDto {
    @ApiProperty({
        example: faker.vehicle.vin(),
        required: true,
    })
    @IsNotEmpty()
    @MaxLength(50)
    @Type(() => String)
    readonly driverLicenceNumber?: string;

    @ApiProperty({
        example: faker.date.future(),
        required: true,
    })
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    readonly driverLicenseExpires?: Date;

    @ApiProperty({
        example: faker.date.past(),
        required: true,
    })
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    readonly dateOfBirth?: Date;

    @ApiProperty({
        example: faker.datatype.uuid(),
        required: true,
    })
    @IsNotEmpty()
    @IsUUID('4')
    readonly user: string
  
}