import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
    COMPANY_ACTIVE_META_KEY,
    COMPANY_BLOCKED_META_KEY,
    COMPANY_INACTIVE_PERMANENT_META_KEY,
} from 'src/modules/company/constants/company.constant';
import { CompanyActiveGuard } from 'src/modules/company/guards/company.active.guard';
import { CompanyCanNotOurSelfGuard } from 'src/modules/company/guards/company.can-not-ourself.guard';
import { CompanyInactivePermanentGuard } from 'src/modules/company/guards/company.inactive-permanent.guard';
import { CompanyNotFoundGuard } from 'src/modules/company/guards/company.not-found.guard';
import { CompanyPutToRequestGuard } from 'src/modules/company/guards/company.put-to-request.guard';

export function CompanyAdminGetGuard(): MethodDecorator {
    return applyDecorators(UseGuards(CompanyPutToRequestGuard, CompanyNotFoundGuard));
}

export function CompanyAdminDeleteGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            CompanyPutToRequestGuard,
            CompanyNotFoundGuard,
            CompanyCanNotOurSelfGuard
        )
    );
}

export function CompanyAdminUpdateGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            CompanyPutToRequestGuard,
            CompanyNotFoundGuard,
            CompanyCanNotOurSelfGuard
        )
    );
}

export function CompanyAdminUpdateInactiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            CompanyPutToRequestGuard,
            CompanyNotFoundGuard,
            CompanyCanNotOurSelfGuard,
            CompanyInactivePermanentGuard,
            CompanyActiveGuard
        ),
        SetMetadata(COMPANY_INACTIVE_PERMANENT_META_KEY, [false]),
        SetMetadata(COMPANY_ACTIVE_META_KEY, [true]),
        SetMetadata(COMPANY_BLOCKED_META_KEY, [false])
    );
}

export function CompanyAdminUpdateActiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            CompanyPutToRequestGuard,
            CompanyNotFoundGuard,
            CompanyCanNotOurSelfGuard,
            CompanyInactivePermanentGuard,
            CompanyActiveGuard
        ),
        SetMetadata(COMPANY_INACTIVE_PERMANENT_META_KEY, [false]),
        SetMetadata(COMPANY_ACTIVE_META_KEY, [false]),
        SetMetadata(COMPANY_BLOCKED_META_KEY, [false])
    );
}

export function CompanyAdminUpdateBlockedGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            CompanyPutToRequestGuard,
            CompanyNotFoundGuard,
            CompanyCanNotOurSelfGuard,
        ),
        SetMetadata(COMPANY_BLOCKED_META_KEY, [false])
    );
}
