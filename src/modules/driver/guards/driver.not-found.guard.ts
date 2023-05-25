import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { ENUM_DRIVER_STATUS_CODE_ERROR } from 'src/modules/driver/constants/driver.status-code.constant';
import { DriverDoc } from 'src/modules/driver/repository/entities/driver.entity';

@Injectable()
export class DriverNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __driver } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __driver: DriverDoc }>();

        if (!__driver) {
            throw new NotFoundException({
                statusCode: ENUM_DRIVER_STATUS_CODE_ERROR.DRIVER_NOT_FOUND_ERROR,
                message: 'driver.error.notFound',
            });
        }

        return true;
    }
}
