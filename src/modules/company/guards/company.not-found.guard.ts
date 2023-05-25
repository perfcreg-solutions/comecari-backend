import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { ENUM_COMPANY_STATUS_CODE_ERROR } from 'src/modules/company/constants/company.status-code.constant';
import { CompanyDoc } from 'src/modules/company/repository/entities/company.entity';

@Injectable()
export class CompanyNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __company } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __company: CompanyDoc }>();

        if (!__company) {
            throw new NotFoundException({
                statusCode: ENUM_COMPANY_STATUS_CODE_ERROR.COMPANY_NOT_FOUND_ERROR,
                message: 'company.error.notFound',
            });
        }

        return true;
    }
}
