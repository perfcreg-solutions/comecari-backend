import { Module } from '@nestjs/common';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserModule } from 'src/modules/user/user.module';
import { CompanyModule } from 'src/modules/company/company.module';
import { CompanyUserController } from 'src/modules/company/controllers/company.user.controller';
import { DriverCompanyController } from 'src/modules/driver/controllers/driver.company.controller';
import { DriverModule } from 'src/modules/driver/driver.module';
@Module({
    controllers: [
        CompanyUserController,
        DriverCompanyController,
    ],
    providers: [],
    exports: [],
    imports: [UserModule, CompanyModule, ApiKeyModule, RoleModule, DriverModule],
})
export class RoutesCompanyModule {}
