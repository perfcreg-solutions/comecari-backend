import { Module } from '@nestjs/common';
import { CompanyRepositoryModule } from 'src/modules/company/repository/company.repository.module';
import { CompanyService } from 'src/modules/company/services/company.service'

@Module({
  imports: [CompanyRepositoryModule],
  exports: [CompanyService],
  providers: [CompanyService],
  controllers: []
})
export class CompanyModule {}
