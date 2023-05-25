import { Module } from '@nestjs/common';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';
import { ApiKeyAdminController } from 'src/common/api-key/controllers/api-key.admin.controller';
import { AuthModule } from 'src/common/auth/auth.module';
import { RoleAdminController } from 'src/modules/role/controllers/role.admin.controller';
import { RoleModule } from 'src/modules/role/role.module';
import { SettingAdminController } from 'src/common/setting/controllers/setting.admin.controller';
import { UserAdminController } from 'src/modules/user/controllers/user.admin.controller';
import { UserModule } from 'src/modules/user/user.module';
import { CompanyAdminController } from 'src/modules/company/controllers/company.admin.controller';
import { CompanyModule } from 'src/modules/company/company.module';
import { DriverAdminController } from 'src/modules/driver/controllers/driver.admin.controller';
import { DriverModule } from 'src/modules/driver/driver.module';

@Module({
    controllers: [
        SettingAdminController,
        ApiKeyAdminController,
        RoleAdminController,
        UserAdminController,
        CompanyAdminController,
        DriverAdminController,
    ],
    providers: [],
    exports: [],
    imports: [ApiKeyModule, RoleModule, UserModule, AuthModule, CompanyModule, DriverModule],
})
export class RoutesAdminModule {}
