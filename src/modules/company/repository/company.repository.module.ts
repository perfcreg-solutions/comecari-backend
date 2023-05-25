import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import {
    CompanyEntity,
    CompanySchema,
} from 'src/modules/company/repository/entities/company.entity';
import { CompanyRepository } from 'src/modules/company/repository/repositories/company.repository';

@Module({
    providers: [CompanyRepository],
    exports: [CompanyRepository],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: CompanyEntity.name,
                    schema: CompanySchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class CompanyRepositoryModule {}
