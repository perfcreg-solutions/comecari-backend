import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { Document } from 'mongoose';

export const TermiiDatabaseName = 'termiis';

@DatabaseEntity({ collection: TermiiDatabaseName })
export class TermiiEntity extends DatabaseMongoUUIDEntityAbstract {
    @Prop({
        required: true,
        type: String,
    })
    pinId: string;

    @Prop({
        required: false,
        type: String,
    })
    phone?: string;

    @Prop({
        required: true,
        type: String
    })
    pin?: string;
}

export const TermiiSchema = SchemaFactory.createForClass(TermiiEntity);

export type TermiiDoc = TermiiEntity & Document;
