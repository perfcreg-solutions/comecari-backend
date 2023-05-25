import { Injectable } from "@nestjs/common";
import {
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
    IDatabaseManyOptions,
    IDatabaseCreateManyOptions,
    IDatabaseSaveOptions,
} from "src/common/database/interfaces/database.interface";
import { IDriverService } from "src/modules/driver/interfaces/driver.service.interface";
import { DriverRepository } from "src/modules/driver/repository/repositories/driver.repository";
import { IDriverDoc, IDriverEntity } from "src/modules/driver/interfaces/driver.interface";
import { DriverCreateDto } from "src/modules/driver/dtos/driver.create.dto";
import { DriverDoc, DriverEntity } from "src/modules/driver/repository/entities/driver.entity";
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { UserEntity } from "src/modules/user/repository/entities/user.entity";
import { HelperStringService } from "src/common/helper/services/helper.string.service";
import { AwsS3Serialization } from "src/common/aws/serializations/aws.s3.serialization";



@Injectable()
export class DriverService implements IDriverService {
    private readonly uploadPath: string;

    constructor(
        private readonly driverRepository: DriverRepository,
        private readonly helperDateService: HelperDateService,
        private readonly helperStringService: HelperStringService,
    ) {
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions)
        : Promise<IDriverEntity[]> {
        return this.driverRepository.findAll<IDriverEntity>(find, {
            ...options,
            join: true
        })
    }

    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        return this.driverRepository.findOneById<T>(_id, options);
    }

    async findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        return this.driverRepository.findOne<T>(find, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.driverRepository.getTotal(find, { ...options, join: true });
    }

    async create(
        {
            driverLicenseExpires,
            driverLicenceNumber,
            dateOfBirth,
            user
        }: DriverCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<DriverDoc> {
        const create: DriverEntity = new DriverEntity();
        create.driverLicenseExpires = driverLicenseExpires;
        create.driverLicenceNumber = driverLicenceNumber;
        create.dateOfBirth = dateOfBirth;
        create.user = user;
        create.isActive = true;
        create.inactivePermanent = false;
        return this.driverRepository.create<DriverEntity>(create, options);
    }

    async active(
        repository: DriverDoc,
        options?: IDatabaseSaveOptions
    ): Promise<DriverEntity> {
        repository.isActive = true;
        repository.inactiveDate = undefined;

        return this.driverRepository.save(repository, options);
    }

    async inactive(
        repository: DriverDoc,
        options?: IDatabaseSaveOptions
    ): Promise<DriverDoc> {
        repository.isActive = false;
        repository.inactiveDate = this.helperDateService.create();

        return this.driverRepository.save(repository, options);
    }

    async inactivePermanent(
        repository: DriverDoc,
        options?: IDatabaseSaveOptions
    ): Promise<DriverDoc> {
        repository.isActive = false;
        repository.inactivePermanent = true;
        repository.inactiveDate = this.helperDateService.create();

        return this.driverRepository.save(repository, options);
    }

    async findOneByUserId<T>(
        user: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        return this.driverRepository.findOne<T>({ user }, options);
    }

    async joinWithUser(repository: DriverDoc): Promise<IDriverDoc> {
        return repository.populate({
            path: 'user',
            localField: 'user',
            foreignField: '_id',
            model: UserEntity.name,
        });
    }

    async update(
        repository: DriverDoc,
            {
                driverLicenseExpires,
                driverLicenceNumber,
                dateOfBirth,
                user
            }: DriverCreateDto,
        options?: IDatabaseSaveOptions
    ): Promise<DriverDoc> {
        repository.driverLicenseExpires = driverLicenseExpires;
        repository.driverLicenceNumber = driverLicenceNumber;
        repository.dateOfBirth = dateOfBirth;
        repository.user = user;
        return this.driverRepository.save(repository, options);
    }
    async delete(
        repository: DriverDoc,
        options?: IDatabaseSaveOptions
    ): Promise<DriverDoc> {
        return this.driverRepository.delete(repository, options);
    }

    async import(
        data: DriverCreateDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean> {

        const companies: DriverEntity[] = data.map(
            ({
                driverLicenseExpires,
                driverLicenceNumber,
                dateOfBirth,
                user
            }) => {
                const create: DriverEntity = new DriverEntity();
                create.driverLicenseExpires = driverLicenseExpires;
                create.driverLicenceNumber = driverLicenceNumber;
                create.dateOfBirth = dateOfBirth;
                create.user = user;
                create.isActive = true;
                create.inactivePermanent = false;
                return create;
            }
        );

        return this.driverRepository.createMany<DriverEntity>(companies, options);
    }


    async createPhotoFilename(): Promise<Record<string, any>> {
        const filename: string = this.helperStringService.random(20);
        return {
            path: this.uploadPath,
            filename: filename,
        };
    }

    async updatePhoto(
        repository: DriverDoc,
        photo: AwsS3Serialization,
        options?: IDatabaseSaveOptions
    ): Promise<DriverDoc> {
        const newPhoto: AwsS3Serialization = {
            path: photo.path,
            pathWithFilename: photo.pathWithFilename,
            filename: photo.filename,
            completedUrl: photo.completedUrl,  // this is the URL you want to add
            baseUrl: photo.baseUrl,
            mime: photo.mime,
        };
        repository.driverLicenseImage.push(newPhoto);
        return this.driverRepository.save(repository, options);
    }
    

}