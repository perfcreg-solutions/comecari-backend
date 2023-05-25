import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { DriverDoc } from 'src/modules/driver/repository/entities/driver.entity';
import { DriverService } from 'src/modules/driver/services/driver.service';

@Injectable()
export class DriverPutToRequestGuard implements CanActivate {
    constructor(private readonly driverService: DriverService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp & { __driver: DriverDoc }>();
        const { params } = request;
        const { driver } = params;

        const check: DriverDoc = await this.driverService.findOneById(driver, {
            join: true,
        });
        request.__driver = check;

        return true;
    }
}
