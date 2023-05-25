import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const COMPANY_DEFAULT_PER_PAGE = 20;
export const COMPANY_DEFAULT_ORDER_BY = 'createdAt';
export const COMPANY_DEFAULT_ORDER_DIRECTION =
    ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const COMPANY_DEFAULT_AVAILABLE_ORDER_BY = [
    'companyName',
    'companyDescription',
    'companyAddress',
    'createdAt',
];
export const COMPANY_DEFAULT_AVAILABLE_SEARCH = [
    'companyName',
    'companyDescription',
    'companyAddress',
];

export const COMPANY_DEFAULT_IS_ACTIVE = [true, false];
export const COMPANY_DEFAULT_BLOCKED = [true, false];
export const COMPANY_DEFAULT_INACTIVE_PERMANENT = [true, false];
