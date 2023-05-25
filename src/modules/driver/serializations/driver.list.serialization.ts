import { OmitType } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { DriverGetSerialization } from 'src/modules/driver/serializations/driver.get.serialization';
import { UserProfileSerialization } from 'src/modules/user/serializations/user.profile.serialization';

export class DriverListSerialization extends OmitType(DriverGetSerialization, [
    'driveLicenceImage',
    'user'
] as const) {
    @Type(() => UserProfileSerialization)
    readonly user: UserProfileSerialization;

    @Exclude()
    readonly driveLicenceImage?: AwsS3Serialization;

    @Exclude()
    readonly driverLicenceNumber?: string;
}
