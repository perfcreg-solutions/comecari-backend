import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { CompanyEntity } from 'src/modules/company/repository/entities/company.entity';
import {
    DriverDoc,
    DriverEntity,
} from 'src/modules/driver/repository/entities/driver.entity';
import { UserEntity } from 'src/modules/user/repository/entities/user.entity';

@Injectable()
export class DriverRepository extends DatabaseMongoUUIDRepositoryAbstract<
    DriverEntity,
    DriverDoc
> {
    constructor(
        @DatabaseModel(DriverEntity.name)
        private readonly driverModel: Model<DriverEntity>
    ) {
        super(driverModel,[ {
            path: 'user',
            localField: 'user',
            foreignField: '_id',
            model: UserEntity.name,
        }, 
        {
            path: 'company',
            localField: 'company',
            foreignField: '_id',
            model: CompanyEntity.name,
        }
    ]);
    }
}