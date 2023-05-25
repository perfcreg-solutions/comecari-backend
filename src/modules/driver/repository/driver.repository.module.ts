import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import {
    DriverEntity,
    DriverSchema,
} from 'src/modules/driver/repository/entities/driver.entity';
import { DriverRepository } from 'src/modules/driver/repository/repositories/driver.repository';

@Module({
    providers: [DriverRepository],
    exports: [DriverRepository],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: DriverEntity.name,
                    schema: DriverSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class DriverRepositoryModule {}
