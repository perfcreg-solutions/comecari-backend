import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ApiKeyEntity } from 'src/common/api-key/repository/entities/api-key.entity';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import {
    TermiiDoc,
    TermiiEntity,
} from 'src/common/termii/repository/entities/termii.entity';

@Injectable()
export class TermiiRepository extends DatabaseMongoUUIDRepositoryAbstract<
    TermiiEntity,
    TermiiDoc
> {
    constructor(
        @DatabaseModel(TermiiEntity.name)
        private readonly TermiiDoc: Model<TermiiEntity>
    ) {
        super(TermiiDoc);
    }
}
