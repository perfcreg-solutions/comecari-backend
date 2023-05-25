import {
    IDatabaseCreateOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
    IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { DriverCreateDto } from 'src/modules/driver/dtos/driver.create.dto';
import { IDriverEntity } from 'src/modules/driver/interfaces/driver.interface';
import { DriverDoc, DriverEntity } from 'src/modules/driver/repository/entities/driver.entity';

export interface IDriverService {
    findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<IDriverEntity[]>;

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
        {
            driverLicenseExpires,
            driverLicenceNumber,
            dateOfBirth
        }: DriverCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<DriverDoc>;

    active(
        repository: DriverDoc,
        options?: IDatabaseSaveOptions
    ): Promise<DriverEntity>;
    inactive(
        repository: DriverDoc,
        options?: IDatabaseSaveOptions
    ): Promise<DriverDoc>;
    inactivePermanent(
        repository: DriverDoc,
        options?: IDatabaseSaveOptions
    ): Promise<DriverDoc>;

    update(
        repository: DriverDoc,
        {
            driverLicenseExpires,
            driverLicenceNumber,
            dateOfBirth
        }: DriverCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<DriverDoc>;
}