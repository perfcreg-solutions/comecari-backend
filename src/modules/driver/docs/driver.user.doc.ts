import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';
import { Doc } from 'src/common/doc/decorators/doc.decorator';

export function DriverUserCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc('driver.create', {
            auth: {
                jwtAccessToken: true,
            }, 
            response: {
                httpStatus: HttpStatus.CREATED,
            }
        })
    )
}

export function DriverUserLicenseDto(): MethodDecorator {
    return applyDecorators(
        Doc('driver.license', {
            auth: {
                jwtAccessToken: true,
            }, 
            response: {
                httpStatus: HttpStatus.OK,
            }
        })
    )
}

export function DriverUserLicenseUploadDoc(): MethodDecorator {
    return applyDecorators(
        Doc<void>('user.upload', {
            auth: {
                jwtAccessToken: true,
            },
            request: {
                bodyType: ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA,
                file: {
                    multiple: true,
                },
            },
        })
    );
}