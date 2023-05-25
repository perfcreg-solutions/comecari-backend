import { faker } from '@faker-js/faker';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { UserProfileSerialization } from 'src/modules/user/serializations/user.profile.serialization';
export class CompanyGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        type: () => UserProfileSerialization,
    })
    @Type(() => UserProfileSerialization)
    readonly user: UserProfileSerialization;

    @ApiProperty({
        example: faker.company.name(),
        nullable: true,
        required: false,
    })
    readonly companyName?: string;

    @ApiProperty({
        example: faker.address.streetAddress(),
    })
    readonly companyAddress: string;

    @ApiProperty({
        allOf: [{ $ref: getSchemaPath(AwsS3Serialization) }],
    })
    readonly companyLogo?: AwsS3Serialization;

    @ApiProperty({
        example: faker.company.catchPhraseDescriptor(),
    })
    readonly companyDescription?: string;

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
