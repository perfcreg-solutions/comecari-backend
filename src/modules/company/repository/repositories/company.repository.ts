import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import {
    CompanyDoc,
    CompanyEntity,
} from 'src/modules/company/repository/entities/company.entity';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';

@Injectable()
export class CompanyRepository extends DatabaseMongoUUIDRepositoryAbstract<
    CompanyEntity,
    CompanyDoc
> {
    constructor(
        @DatabaseModel(CompanyEntity.name)
        private readonly companyModel: Model<CompanyEntity>
    ) {
        super(companyModel, {
            path: 'user',
            localField: 'user',
            foreignField: '_id',
            model: UserEntity.name,
        });
    }
}