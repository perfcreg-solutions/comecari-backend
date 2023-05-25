import { Module } from '@nestjs/common';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserUserController } from 'src/modules/user/controllers/user.user.controller';
import { UserModule } from 'src/modules/user/user.module';
import { CompanyModule } from 'src/modules/company/company.module';
@Module({
    controllers: [
        UserUserController
    ],
    providers: [],
    exports: [],
    imports: [UserModule, CompanyModule, ApiKeyModule, RoleModule],
})
export class RoutesUserModule {}
