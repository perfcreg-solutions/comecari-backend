import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import {
    COMPANY_ACTIVE_META_KEY,
    COMPANY_BLOCKED_META_KEY,
    COMPANY_INACTIVE_PERMANENT_META_KEY,
} from 'src/modules/company/constants/company.constant';
import { CompanyPayloadPutToRequestGuard } from 'src/modules/company/guards/payload/company.payload.put-to-request.guard';
import { CompanyActiveGuard } from 'src/modules/company/guards/company.active.guard';
import { CompanyInactivePermanentGuard } from 'src/modules/company/guards/company.inactive-permanent.guard';
import { CompanyNotFoundGuard } from 'src/modules/company/guards/company.not-found.guard';
import { CompanyDoc, CompanyEntity } from '../repository/entities/company.entity';

export const GetCompany = createParamDecorator(
    (returnPlain: boolean, ctx: ExecutionContext): CompanyDoc | CompanyEntity => {
        const { __company } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __company: CompanyDoc }>();
        return returnPlain ? __company.toObject() : __company;
    }
);

export function CompanyProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(CompanyPayloadPutToRequestGuard, CompanyNotFoundGuard)
    );
}

export function CompanyAuthProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            CompanyInactivePermanentGuard,
            CompanyActiveGuard
        ),
        SetMetadata(COMPANY_INACTIVE_PERMANENT_META_KEY, [false]),
        SetMetadata(COMPANY_BLOCKED_META_KEY, [false]),
        SetMetadata(COMPANY_ACTIVE_META_KEY, [true])
    );
}
