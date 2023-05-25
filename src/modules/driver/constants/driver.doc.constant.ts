export const USER_ACTIVE_META_KEY = 'UserActiveMetaKey';
export const USER_INACTIVE_PERMANENT_META_KEY = 'UserInactivePermanentMetaKey';
export const USER_BLOCKED_META_KEY = 'UserBlockedMetaKey';
import { faker } from '@faker-js/faker';

export const DriverDocQueryIsActive = [
    {
        name: 'isActive',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        example: 'true,false',
        description: "boolean value with ',' delimiter",
    },
];

export const DriverDocQueryBlocked = [
    {
        name: 'blocked',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        example: 'true,false',
        description: "boolean value with ',' delimiter",
    },
];

export const DriverDocParamsGet = [
    {
        name: 'driver',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        example: faker.datatype.uuid(),
    },
];
