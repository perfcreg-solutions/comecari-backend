import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { COMPANY_ACTIVE_META_KEY } from 'src/modules/company/constants/company.constant';
import { ENUM_COMPANY_STATUS_CODE_ERROR } from 'src/modules/company/constants/company.status-code.constant';
import { CompanyDoc } from 'src/modules/company/repository/entities/company.entity';

@Injectable()
export class CompanyActiveGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
            COMPANY_ACTIVE_META_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!required) {
            return true;
        }

        const { __company } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __company: CompanyDoc }>();

        if (!required.includes(__company.isActive)) {
            throw new BadRequestException({
                statusCode: ENUM_COMPANY_STATUS_CODE_ERROR.COMPANY_IS_ACTIVE_ERROR,
                message: 'company.error.isActiveInvalid',
            });
        }
        return true;
    }
}
