import { ENUM_LOGGER_LEVEL } from 'src/common/termii/constants/termii.enum.constant';

export interface ITermiiOptions {
    description?: string;
    tags?: string[];
    level?: ENUM_LOGGER_LEVEL;
}
