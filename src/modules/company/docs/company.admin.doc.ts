import { applyDecorators, HttpStatus } from '@nestjs/common';
import { Doc, DocPaging } from 'src/common/doc/decorators/doc.decorator';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import {
    CompanyDocParamsGet,
    CompanyDocQueryBlocked,
    CompanyDocQueryIsActive,
} from 'src/modules/company/constants/company.doc.constant';
import { CompanyGetSerialization } from 'src/modules/company/serializations/company.get.serialization';
import { CompanyListSerialization } from 'src/modules/company/serializations/company.list.serialization';

export function CompanyAdminListDoc(): MethodDecorator {
    return applyDecorators(
        DocPaging<CompanyListSerialization>('company.list', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                queries: [...CompanyDocQueryIsActive, ...CompanyDocQueryBlocked],
            },
            response: {
                serialization: CompanyListSerialization,
            },
        })
    );
}

export function CompanyAdminGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc<CompanyGetSerialization>('company.get', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: CompanyDocParamsGet,
            },
            response: { serialization: CompanyGetSerialization },
        })
    );
}

export function CompanyAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ResponseIdSerialization>('company.create', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                httpStatus: HttpStatus.CREATED,
                serialization: ResponseIdSerialization,
            },
        })
    );
}

export function CompanyAdminUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ResponseIdSerialization>('company.update', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: CompanyDocParamsGet,
            },
            response: { serialization: ResponseIdSerialization },
        })
    );
}

export function CompanyAdminDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('company.delete', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: CompanyDocParamsGet,
            },
        })
    );
}

export function CompanyAdminImportDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('company.import', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                httpStatus: HttpStatus.CREATED,
            },
        })
    );
}

export function CompanyAdminExportDoc(): MethodDecorator {
    return applyDecorators(
        Doc('company.export', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                httpStatus: HttpStatus.OK,
            },
        })
    );
}

export function CompanyAdminActiveDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('company.active', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: CompanyDocParamsGet,
            },
        })
    );
}

export function CompanyAdminInactiveDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('company.inactive', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: CompanyDocParamsGet,
            },
        })
    );
}

export function CompanyAdminBlockedDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('company.blocked', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: CompanyDocParamsGet,
            },
        })
    );
}
