import { HttpStatus, applyDecorators } from '@nestjs/common';
import { Doc } from 'src/common/doc/decorators/doc.decorator';
import { CompanyDocParamsGet } from '../constants/company.doc.constant';
import { CompanyGetSerialization } from '../serializations/company.get.serialization';

export function CompanyUserDeleteSelfDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('company.deleteSelf', {
            auth: {
                jwtAccessToken: true,
            },
        })
    );
}

export function CompanyUserCreateDoc(): MethodDecorator{
    return applyDecorators(
        Doc('company.create', {
            auth: {
                jwtAccessToken: true,
            },
            response: {
                httpStatus: HttpStatus.CREATED
            }
        })
    )
}

export function CompanyUserUpdateDoc(): MethodDecorator{
    return applyDecorators(
        Doc('company.update', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                params: CompanyDocParamsGet, //
            },
            response: {
                httpStatus: HttpStatus.OK
            }
        })
    )
}

export function ComapanyUserGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc<CompanyGetSerialization>('company.get', {
            auth: {
                jwtAccessToken: true,
            },
            response: { serialization: CompanyGetSerialization },
        })
    );
}