import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import {
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseManyOptions,
    IDatabaseCreateManyOptions,
    IDatabaseGetTotalOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { CompanyCreateDto } from 'src/modules/company/dtos/company.create.dto';
import { ICompanyEntity } from 'src/modules/company/interfaces/company.interface';
import { CompanyDoc, CompanyEntity } from 'src/modules/company/repository/entities/company.entity';

export interface ICompanyService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<ICompanyEntity[]>;

    findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;

    findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;

    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    create(
        { companyName,
            companyAddress,
            companyDescription,
        }: CompanyCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<CompanyDoc>;

    active(
        repository: CompanyDoc,
        options?: IDatabaseSaveOptions
    ): Promise<CompanyEntity>;
    inactive(
        repository: CompanyDoc,
        options?: IDatabaseSaveOptions
    ): Promise<CompanyDoc>;
    inactivePermanent(
        repository: CompanyDoc,
        options?: IDatabaseSaveOptions
    ): Promise<CompanyDoc>;

    update(
        repository: CompanyDoc,
        { companyName,
            companyAddress,
            companyDescription,
        }: CompanyCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<CompanyDoc>;
}