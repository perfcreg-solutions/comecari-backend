import { applyDecorators, HttpStatus } from '@nestjs/common';
import { Doc } from 'src/common/doc/decorators/doc.decorator';
import { UserLoginSerialization } from 'src/modules/user/serializations/user.login.serialization';

export function UserPublicLoginDoc(): MethodDecorator {
    return applyDecorators(
        Doc<UserLoginSerialization>('user.login', {
            auth: {
                jwtAccessToken: false,
            },
            response: {
                serialization: UserLoginSerialization,
            },
        })
    );
}

export function UserPublicSignUpDoc(): MethodDecorator {
    return applyDecorators(
        Doc('user.signUp', {
            auth: {
                jwtAccessToken: false,
            },
            response: {
                httpStatus: HttpStatus.CREATED,
            },
        })
    );
}

export function UserPublicAddPhoneNumber(): MethodDecorator {
    return applyDecorators(
        Doc(`user.check.PhoneNumber`, {
            auth: {
                jwtAccessToken: false,
            },
            response: {
                httpStatus: HttpStatus.OK
            }
        })
    )
}

export function UserPublicVerifyNumber(): MethodDecorator {
    return applyDecorators(
        Doc('user.verify.number', {
            auth: {
                jwtAccessToken: false,
            },
            response: {
                httpStatus: HttpStatus.OK,
            }
        })
    )
}


