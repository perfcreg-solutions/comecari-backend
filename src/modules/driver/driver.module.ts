import { Module } from '@nestjs/common';
import { DriverRepositoryModule } from 'src/modules/driver/repository/driver.repository.module';
import { DriverService } from './services/driver.service';

@Module({
  imports: [DriverRepositoryModule],
  controllers: [],
  exports: [DriverService],
  providers: [DriverService],
})
export class DriverModule {}
