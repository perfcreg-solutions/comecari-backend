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
import { ICompanyService } from "src/modules/company/interfaces/company.service.interface";
import { CompanyRepository } from "src/modules/company/repository/repositories/company.repository";
import { ICompanyDoc, ICompanyEntity } from "src/modules/company/interfaces/company.interface";
import { CompanyCreateDto } from "src/modules/company/dtos/company.create.dto";
import { CompanyDoc, CompanyEntity } from "src/modules/company/repository/entities/company.entity";
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { UserEntity } from "src/modules/user/repository/entities/user.entity";
import { CompanySignUpDto } from "../dtos/company.sign-up.dto";


@Injectable()
export class CompanyService implements ICompanyService {

    constructor(
        private readonly companyRepository: CompanyRepository,
        private readonly helperDateService: HelperDateService,
    ) {
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions)
        : Promise<ICompanyEntity[]> {
        return this.companyRepository.findAll<ICompanyEntity>(find, {
            ...options,
            join: true
        })
    }

    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        return this.companyRepository.findOneById<T>(_id, options);
    }

    async findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        return this.companyRepository.findOne<T>(find, options);
    }

    async getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        return this.companyRepository.getTotal(find, { ...options, join: true });
    }

    async create(
        {
            companyName,
            companyAddress,
            companyDescription,
            user
        }: CompanyCreateDto,
        options?: IDatabaseCreateOptions
    ): Promise<CompanyDoc> {
        const create: CompanyEntity = new CompanyEntity();
        create.companyName = companyName;
        create.companyAddress = companyAddress;
        create.companyDescription = companyDescription;
        create.user = user;
        create.isActive = true;
        create.inactivePermanent = false;
        return this.companyRepository.create<CompanyEntity>(create, options);
    }

    async active(
        repository: CompanyDoc,
        options?: IDatabaseSaveOptions
    ): Promise<CompanyEntity> {
        repository.isActive = true;
        repository.inactiveDate = undefined;

        return this.companyRepository.save(repository, options);
    }

    async inactive(
        repository: CompanyDoc,
        options?: IDatabaseSaveOptions
    ): Promise<CompanyDoc> {
        repository.isActive = false;
        repository.inactiveDate = this.helperDateService.create();

        return this.companyRepository.save(repository, options);
    }

    async inactivePermanent(
        repository: CompanyDoc,
        options?: IDatabaseSaveOptions
    ): Promise<CompanyDoc> {
        repository.isActive = false;
        repository.inactivePermanent = true;
        repository.inactiveDate = this.helperDateService.create();

        return this.companyRepository.save(repository, options);
    }

    async findOneByUserId<T>(
        user: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        return this.companyRepository.findOne<T>({user}, options);
    }

    async joinWithUser(repository: CompanyDoc): Promise<ICompanyDoc> {
        return repository.populate({
            path: 'user',
            localField: 'user',
            foreignField: '_id',
            model: UserEntity.name,
        });
    }

    async update(
        repository: CompanyDoc,
        { companyName, companyDescription, companyAddress }: CompanySignUpDto,
        options?: IDatabaseSaveOptions
    ): Promise<CompanyDoc> {
        repository.companyName = companyName;
        repository.companyDescription = companyDescription;
        repository.companyAddress = companyAddress;
       return this.companyRepository.save(repository, options);
    }
    async delete(
        repository: CompanyDoc,
        options?: IDatabaseSaveOptions
    ): Promise<CompanyDoc> {
        return this.companyRepository.delete(repository, options);
    }

    async import(
        data: CompanySignUpDto[],
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean> {
       
        const companies: CompanyEntity[] = data.map(
            ({ companyAddress, companyDescription, companyName}) => {
                const create: CompanyEntity = new CompanyEntity();
                create.companyAddress = companyAddress;
                create.companyDescription = companyDescription;
                create.companyName = companyName;
                create.isActive = true;
                create.inactivePermanent = false;
                return create;
            }
        );

        return this.companyRepository.createMany<CompanyEntity>(companies, options);
    }


}