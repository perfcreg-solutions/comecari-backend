import { faker } from '@faker-js/faker';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { RoleGetSerialization } from 'src/modules/role/serializations/role.get.serialization';
import { ENUM_USER_SIGN_UP_FROM } from 'src/modules/user/constants/user.enum.constant';
import { UserGetSerialization } from 'src/modules/user/serializations/user.get.serialization';
import { UserProfileSerialization } from 'src/modules/user/serializations/user.profile.serialization';

export class DriverGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        type: () => UserProfileSerialization
    })
    @Type(() => UserProfileSerialization)
    readonly user: UserProfileSerialization;

    @ApiProperty({
        example: faker.vehicle.vin(),
        required: true,
    })
    readonly driverLicenceNumber?: string;

    @ApiProperty({
        example: faker.date.future(),
        required: true,
    })
    readonly driverLicenseExpires: string;

    @ApiProperty({
        description: 'Date created at',
        example: faker.date.recent(),
        required: true,
    })
    readonly dirthOfBirth: Date;

    @ApiProperty({
        example: true,
    })
    readonly isActive: boolean;

    @ApiProperty({
        example: true,
    })
    readonly inactivePermanent: boolean;

    @ApiProperty({
        required: false,
        nullable: true,
        example: faker.date.recent(),
    })
    readonly inactiveDate?: Date;

    @ApiProperty({
        allOf: [{ $ref: getSchemaPath(AwsS3Serialization) }],
    })
    readonly driveLicenceImage?: AwsS3Serialization;


    @ApiProperty({
        description: 'Date created at',
        example: faker.date.recent(),
        required: true,
    })
    readonly createdAt: Date;

    @ApiProperty({
        description: 'Date updated at',
        example: faker.date.recent(),
        required: false,
    })
    readonly updatedAt: Date;

    @Exclude()
    readonly deletedAt?: Date;
}
