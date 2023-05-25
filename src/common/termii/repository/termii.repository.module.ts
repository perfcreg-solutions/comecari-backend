import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import {
    TermiiEntity,
    TermiiSchema,
} from 'src/common/termii/repository/entities/termii.entity';
import { TermiiRepository } from 'src/common/termii/repository/repositories/termii.repository';

@Module({
    providers: [TermiiRepository],
    exports: [TermiiRepository],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: TermiiEntity.name,
                    schema: TermiiSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class TermiiRepositoryModule {}
