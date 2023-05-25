import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { DRIVER_INACTIVE_PERMANENT_META_KEY } from 'src/modules/driver/constants/driver.constant';
import { ENUM_DRIVER_STATUS_CODE_ERROR } from 'src/modules/driver/constants/driver.status-code.constant';
import { DriverDoc } from 'src/modules/driver/repository/entities/driver.entity';

@Injectable()
export class DriverInactivePermanentGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
            DRIVER_INACTIVE_PERMANENT_META_KEY,
            [context.getHandler(), context.getClass()]
        );
        
        if (!required) {
            return true;
        }

        const { __driver } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __driver: DriverDoc }>();

        if (!required.includes(__driver.inactivePermanent)) {
            throw new BadRequestException({
                statusCode: ENUM_DRIVER_STATUS_CODE_ERROR.DRIVER_INACTIVE_ERROR,
                message: 'driver.error.inactivePermanent',
            });
        }
        return true;
    }
}
