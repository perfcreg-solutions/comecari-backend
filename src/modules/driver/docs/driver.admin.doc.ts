import { applyDecorators, HttpStatus } from '@nestjs/common';
import { Doc, DocPaging } from 'src/common/doc/decorators/doc.decorator';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import {
    DriverDocParamsGet,
    DriverDocQueryBlocked,
    DriverDocQueryIsActive,
} from 'src/modules/driver/constants/driver.doc.constant';
import { DriverGetSerialization } from 'src/modules/driver/serializations/driver.get.serialization';
import { DriverListSerialization } from 'src/modules/driver/serializations/driver.list.serialization';

export function DriverAdminListDoc(): MethodDecorator {
    return applyDecorators(
        DocPaging<DriverListSerialization>('driver.list', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                queries: [...DriverDocQueryIsActive, ...DriverDocQueryBlocked],
            },
            response: {
                serialization: DriverListSerialization,
            },
        })
    );
}

export function DriverAdminGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc<DriverGetSerialization>('driver.get', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: DriverDocParamsGet,
            },
            response: { serialization: DriverGetSerialization },
        })
    );
}

export function DriverAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ResponseIdSerialization>('driver.create', {
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

export function DriverAdminUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc<ResponseIdSerialization>('driver.update', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: DriverDocParamsGet,
            },
            response: { serialization: ResponseIdSerialization },
        })
    );
}

export function DriverAdminDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('driver.delete', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: DriverDocParamsGet,
            },
        })
    );
}

export function DriverAdminImportDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('driver.import', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                httpStatus: HttpStatus.CREATED,
            },
        })
    );
}

export function DriverAdminExportDoc(): MethodDecorator {
    return applyDecorators(
        Doc('driver.export', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                httpStatus: HttpStatus.OK,
            },
        })
    );
}

export function DriverAdminActiveDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('driver.active', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: DriverDocParamsGet,
            },
        })
    );
}

export function DriverAdminInactiveDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('driver.inactive', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: DriverDocParamsGet,
            },
        })
    );
}

export function DriverAdminBlockedDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('driver.blocked', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: DriverDocParamsGet,
            },
        })
    );
}
