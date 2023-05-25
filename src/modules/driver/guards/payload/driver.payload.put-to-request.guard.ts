import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { DriverDoc } from 'src/modules/driver/repository/entities/driver.entity';
import { DriverService } from 'src/modules/driver/services/driver.service';

@Injectable()
export class DriverPayloadPutToRequestGuard implements CanActivate {
    constructor(private readonly driverService: DriverService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp & { __driver: DriverDoc }>();
        const { driver } = request;

        const check: DriverDoc = await this.driverService.findOneById(driver._id, {
            join: true,
        });
        request.__driver = check;
        return true;
    }
}
