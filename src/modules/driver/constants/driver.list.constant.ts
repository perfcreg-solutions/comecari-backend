import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const DRIVER_DEFAULT_PER_PAGE = 20;
export const DRIVER_DEFAULT_ORDER_BY = 'createdAt';
export const DRIVER_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const DRIVER_DEFAULT_AVAILABLE_ORDER_BY = [
    'createdAt',
    'dateOfBirth'
];
export const DRIVER_DEFAULT_AVAILABLE_SEARCH = [
    'driverLicenceNumber'
];

export const DRIVER_DEFAULT_IS_ACTIVE = [true, false];
export const DRIVER_DEFAULT_BLOCKED = [true, false];
export const DRIVER_DEFAULT_INACTIVE_PERMANENT = [true, false];
