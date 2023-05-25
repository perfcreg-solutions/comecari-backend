import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
    DRIVER_ACTIVE_META_KEY,
    DRIVER_BLOCKED_META_KEY,
    DRIVER_INACTIVE_PERMANENT_META_KEY,
} from 'src/modules/driver/constants/driver.constant';
import { DriverActiveGuard } from 'src/modules/driver/guards/driver.active.guard';
import { DriverCanNotOurSelfGuard } from 'src/modules/driver/guards/driver.can-not-ourself.guard';
import { DriverInactivePermanentGuard } from 'src/modules/driver/guards/driver.inactive-permanent.guard';
import { DriverNotFoundGuard } from 'src/modules/driver/guards/driver.not-found.guard';
import { DriverPutToRequestGuard } from 'src/modules/driver/guards/driver.put-to-request.guard';

export function DriverAdminGetGuard(): MethodDecorator {
    return applyDecorators(UseGuards(DriverPutToRequestGuard, DriverNotFoundGuard,));
}

export function DriverAdminDeleteGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            DriverPutToRequestGuard,
            DriverNotFoundGuard,
            DriverCanNotOurSelfGuard
        )
    );
}

export function DriverAdminUpdateGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            DriverPutToRequestGuard,
            DriverNotFoundGuard,
            DriverCanNotOurSelfGuard
        )
    );
}

export function DriverAdminUpdateInactiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            DriverPutToRequestGuard,
            DriverNotFoundGuard,
            DriverCanNotOurSelfGuard,
            DriverInactivePermanentGuard,
            DriverActiveGuard
        ),
        SetMetadata(DRIVER_INACTIVE_PERMANENT_META_KEY, [false]),
        SetMetadata(DRIVER_ACTIVE_META_KEY, [true]),
        SetMetadata(DRIVER_BLOCKED_META_KEY, [false])
    );
}

export function DriverAdminUpdateActiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            DriverPutToRequestGuard,
            DriverNotFoundGuard,
            DriverCanNotOurSelfGuard,
            DriverInactivePermanentGuard,
            DriverActiveGuard
        ),
        SetMetadata(DRIVER_INACTIVE_PERMANENT_META_KEY, [false]),
        SetMetadata(DRIVER_ACTIVE_META_KEY, [false]),
        SetMetadata(DRIVER_BLOCKED_META_KEY, [false])
    );
}

export function DriverAdminUpdateBlockedGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            DriverPutToRequestGuard,
            DriverNotFoundGuard,
            DriverCanNotOurSelfGuard,
        ),
        SetMetadata(DRIVER_BLOCKED_META_KEY, [false])
    );
}
