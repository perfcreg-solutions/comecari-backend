 import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';

export const CompanyDatabaseName = 'companies';

@DatabaseEntity({ collection: CompanyDatabaseName })
export class CompanyEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({
        required: true,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
        maxlength: 200,
    })
    companyName?: string;

    @Prop({
        required: false,
        _id: false,
        type: {
            path: String,
            pathWithFilename: String,
            filename: String,
            completedUrl: String,
            baseUrl: String,
            mime: String,
        },
    })
    companyLogo?: AwsS3Serialization;

    @Prop({
        required: false,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
        maxlength: 500,
    })
    companyDescription: string;

    @Prop({
        required: true,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
        maxlength: 300,
    })
    companyAddress: string;

    @Prop({
        required: true,
        ref: UserEntity.name,
        index: true,
    })
    user: string;

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

export const CompanySchema = SchemaFactory.createForClass(CompanyEntity);

export type CompanyDoc = CompanyEntity & Document;

CompanySchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
    this.companyName = this.companyName.toLowerCase();
    this.companyAddress = this.companyAddress.toLowerCase();
    this.companyDescription = this.companyDescription.toLowerCase();
    
    next();
});
