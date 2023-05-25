import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';
import {EMUM_VERIFICATION_STATUS_TYPE} from 'src/modules/driver/constants/driver.enum.constant'
import { CompanyEntity } from 'src/modules/company/repository/entities/company.entity';
export const DriverDatabaseName = 'drivers';

@DatabaseEntity({ collection: DriverDatabaseName })
export class DriverEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({
        required: true,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
        maxlength: 50,
    })
    driverLicenceNumber?: string;

    @Prop({
        required: true,
        type: [String],
    })
    driverLicenseImage?: AwsS3Serialization[];

    @Prop({
        required: true,
        type: Date,
    })
    driverLicenseExpires?: Date;

    @Prop({
        required: true,
        type: Date,
    })
    dateOfBirth: Date;

    @Prop({
            required: true,
            type: String,
            enum: EMUM_VERIFICATION_STATUS_TYPE,
            index: true,
        })
    verificationStatus: EMUM_VERIFICATION_STATUS_TYPE;

    @Prop({
        required: true,
        ref: UserEntity.name,
        index: true,
    })
    user: string;

    @Prop({
        required: false,
        ref: CompanyEntity.name,
        index: true,
    })
    company: string;

    @Prop({
        required: true,
        default: true,
        index: true,
        type: Boolean,
    })
    isActive: boolean;

    @Prop({
        required: true,
        default: false,
        index: true,
        type: Boolean,
    })
    inactivePermanent: boolean;

    @Prop({
        required: false,
        type: Date,
    })
    inactiveDate?: Date;
}

export const DriverSchema = SchemaFactory.createForClass(DriverEntity);

export type DriverDoc = DriverEntity & Document;

DriverSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
    next();
});
