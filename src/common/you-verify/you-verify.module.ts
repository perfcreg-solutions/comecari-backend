import { Module } from '@nestjs/common';
import { YouVerifyService } from 'src/common/you-verify/services/you-verify.service';

@Module({
    exports: [YouVerifyService],
    providers: [YouVerifyService],
    imports: [],
    controllers: [],
})
export class YouVerifyModule {}
