import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { CompanyDoc } from 'src/modules/company/repository/entities/company.entity';
import { CompanyService } from 'src/modules/company/services/company.service';

@Injectable()
export class CompanyPutToRequestGuard implements CanActivate {
    constructor(private readonly companyService: CompanyService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp & { __company: CompanyDoc }>();
        const { params } = request;
        const { company } = params;

        const check: CompanyDoc = await this.companyService.findOneById(company, {
            join: true,
        });
        request.__company = check;

        return true;
    }
}
