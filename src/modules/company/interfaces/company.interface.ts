import {
    CompanyDoc,
    CompanyEntity,
} from 'src/modules/company/repository/entities/company.entity';
import {
    UserDoc,
    UserEntity,
} from 'src/modules/user/repository/entities/user.entity';

export interface ICompanyEntity extends Omit<CompanyEntity, 'user'> {
    user: UserEntity;
}

export interface ICompanyDoc extends Omit<CompanyDoc, 'user'> {
    user: UserDoc;
}