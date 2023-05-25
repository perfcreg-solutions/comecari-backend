import { Global, Module } from '@nestjs/common';
import { TermiiRepositoryModule } from 'src/common/termii/repository/termii.repository.module';
import { TermiiService } from './services/termii.service';

@Global()
@Module({
    providers: [TermiiService],
    exports: [TermiiService],
    imports: [TermiiRepositoryModule],
})
export class TermiiModule {}
