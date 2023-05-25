import {
    DriverDoc,
    DriverEntity,
} from 'src/modules/driver/repository/entities/driver.entity';
import {
    UserDoc,
    UserEntity,
} from 'src/modules/user/repository/entities/user.entity';

export interface IDriverEntity extends Omit<DriverEntity, 'user'> {
    user: UserEntity;
}

export interface IDriverDoc extends Omit<DriverDoc, 'user'> {
    user: UserDoc;
}