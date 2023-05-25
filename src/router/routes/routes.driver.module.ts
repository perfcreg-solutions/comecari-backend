import { Module } from '@nestjs/common';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';
import { AuthModule } from 'src/common/auth/auth.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserModule } from 'src/modules/user/user.module';
import { CompanyModule } from 'src/modules/company/company.module';
import { DriverModule } from 'src/modules/driver/driver.module';
import { DriverUserController } from 'src/modules/driver/controllers/driver.user.controller';
import { YouVerifyModule } from 'src/common/you-verify/you-verify.module';
// import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { AwsModule } from 'src/common/aws/aws.module';

@Module({
    controllers: [
        DriverUserController,
    ],
    providers: [],
    exports: [],
    imports: [
        ApiKeyModule, 
        RoleModule, 
        UserModule, 
        AuthModule, 
        CompanyModule, 
        DriverModule,
        YouVerifyModule,
        // AwsS3Service
        AwsModule
    ],
})
export class RoutesDriverModule {}
