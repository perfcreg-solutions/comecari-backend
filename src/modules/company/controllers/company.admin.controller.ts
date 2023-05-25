import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Put,
    InternalServerErrorException,
    NotFoundException,
    UploadedFile,
    Patch,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/common/auth/services/auth.service';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { UploadFileSingle } from 'src/common/file/decorators/file.decorator';
import { IFileExtract } from 'src/common/file/interfaces/file.interface';
import { FileExtractPipe } from 'src/common/file/pipes/file.extract.pipe';
import { FileRequiredPipe } from 'src/common/file/pipes/file.required.pipe';
import { FileSizeExcelPipe } from 'src/common/file/pipes/file.size.pipe';
import { FileTypeExcelPipe } from 'src/common/file/pipes/file.type.pipe';
import { FileValidationPipe } from 'src/common/file/pipes/file.validation.pipe';
import { ENUM_HELPER_FILE_TYPE } from 'src/common/helper/constants/helper.enum.constant';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import {
    Response,
    ResponseExcel,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { ENUM_COMPANY_STATUS_CODE_ERROR } from 'src/modules/company/constants/company.status-code.constant';
import {
    CompanyAdminDeleteGuard,
    CompanyAdminGetGuard,
    CompanyAdminUpdateActiveGuard,
    CompanyAdminUpdateGuard,
    CompanyAdminUpdateInactiveGuard,
} from 'src/modules/company/decorators/company.admin.decorator';
import { GetCompany } from 'src/modules/company/decorators/company.decorator';
import { CompanyCreateDto } from 'src/modules/company/dtos/company.create.dto';
import { CompanyImportDto } from 'src/modules/company/dtos/company.import.dto';
import { CompanyRequestDto } from 'src/modules/company/dtos/company.request.dto';
import {
    ICompanyDoc,
    ICompanyEntity,
} from 'src/modules/company/interfaces/company.interface';
import { CompanyGetSerialization } from 'src/modules/company/serializations/company.get.serialization';
import { CompanyListSerialization } from 'src/modules/company/serializations/company.list.serialization';
import { CompanyService } from 'src/modules/company/services/company.service';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
// import { CompanyUpdateNameDto } from 'src/modules/company/dtos/company.update-name.dto';
import {
    COMPANY_DEFAULT_AVAILABLE_ORDER_BY,
    COMPANY_DEFAULT_AVAILABLE_SEARCH,
    COMPANY_DEFAULT_BLOCKED,
    COMPANY_DEFAULT_INACTIVE_PERMANENT,
    COMPANY_DEFAULT_IS_ACTIVE,
    COMPANY_DEFAULT_ORDER_BY,
    COMPANY_DEFAULT_ORDER_DIRECTION,
    COMPANY_DEFAULT_PER_PAGE,
} from 'src/modules/company/constants/company.list.constant';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    PaginationQuery,
    PaginationQueryFilterEqualObjectId,
    PaginationQueryFilterInBoolean,
} from 'src/common/pagination/decorators/pagination.decorator';
import { CompanyDoc } from 'src/modules/company/repository/entities/company.entity';
import { RoleService } from 'src/modules/role/services/role.service';
import { PolicyAbilityProtected } from 'src/common/policy/decorators/policy.decorator';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_SUBJECT,
} from 'src/common/policy/constants/policy.enum.constant';
import {
    CompanyAdminActiveDoc,
    CompanyAdminCreateDoc,
    CompanyAdminDeleteDoc,
    CompanyAdminExportDoc,
    CompanyAdminGetDoc,
    CompanyAdminImportDoc,
    CompanyAdminInactiveDoc,
    CompanyAdminListDoc,
    CompanyAdminUpdateDoc,
} from 'src/modules/company/docs/company.admin.doc';
import { CompanySignUpDto } from '../dtos/company.sign-up.dto';

@ApiTags('modules.admin.company')
@Controller({
    version: '1',
    path: '/company',
})
export class CompanyAdminController {
    constructor(
        private readonly authService: AuthService,
        private readonly paginationService: PaginationService,
        private readonly companyService: CompanyService,
        private readonly roleService: RoleService
    ) {}

    @CompanyAdminListDoc()
    @ResponsePaging('company.list', {
        serialization: CompanyListSerialization,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.COMPANY,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @AuthJwtAdminAccessProtected()
    @Get('/list')
    async list(
        @PaginationQuery(
            COMPANY_DEFAULT_PER_PAGE,
            COMPANY_DEFAULT_ORDER_BY,
            COMPANY_DEFAULT_ORDER_DIRECTION,
            COMPANY_DEFAULT_AVAILABLE_SEARCH,
            COMPANY_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryFilterInBoolean('isActive', COMPANY_DEFAULT_IS_ACTIVE)
        isActive: Record<string, any>,
        @PaginationQueryFilterInBoolean('blocked', COMPANY_DEFAULT_BLOCKED)
        blocked: Record<string, any>,
        @PaginationQueryFilterInBoolean(
            'inactivePermanent',
            COMPANY_DEFAULT_INACTIVE_PERMANENT
        )
        inactivePermanent: Record<string, any>,
        @PaginationQueryFilterEqualObjectId('role')
        role: Record<string, any>
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
            ...isActive,
            ...blocked,
            ...inactivePermanent,
            ...role,
        };

        const companys: ICompanyEntity[] = await this.companyService.findAll(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: _order,
        });
        const total: number = await this.companyService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            data: companys,
        };
    }

    @CompanyAdminGetDoc()
    @Response('company.get', {
        serialization: CompanyGetSerialization,
    })
    @CompanyAdminGetGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.COMPANY,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(CompanyRequestDto)
    @Get('/get/:company')
    async get(@GetCompany() company: CompanyDoc): Promise<IResponse> {
        const companyWithUser: ICompanyDoc = await this.companyService.joinWithUser(
            company
        );
        return { data: companyWithUser.toObject() };
    }

    @CompanyAdminCreateDoc()
    @Response('company.create', {
        serialization: ResponseIdSerialization,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.COMPANY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
    })
    @AuthJwtAdminAccessProtected()
    @Post('/create')
    async create(
        @Body()
        {companyAddress,companyDescription,companyName,user }: CompanyCreateDto
    ): Promise<IResponse> {
        const promises: Promise<any>[] = [
            this.companyService.findOneByUserId(user)
        ];
        const [findOneByUserId] = await Promise.all(
            promises
        );
        if (findOneByUserId) {
            throw new NotFoundException({
                statusCode: ENUM_COMPANY_STATUS_CODE_ERROR.COMPANY_EXIST_ERROR,
                message: 'company.error.exist',
            });
        } 
        try {
            const created: CompanyDoc = await this.companyService.create(
                {
                    companyAddress,
                    companyDescription,
                    companyName,
                    user,
                },
            );
            return {
                data: { _id: created._id },
            };
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }
    }

    @CompanyAdminDeleteDoc()
    @Response('company.delete')
    @CompanyAdminDeleteGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.COMPANY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(CompanyRequestDto)
    @Delete('/delete/:company')
    async delete(@GetCompany() company: CompanyDoc): Promise<void> {
        try {
            await this.companyService.delete(company);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @CompanyAdminUpdateDoc()
    @Response('company.update', {
        serialization: ResponseIdSerialization,
    })
    @CompanyAdminUpdateGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.COMPANY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(CompanyRequestDto)
    @Put('/update/:company')
    async update(
        @GetCompany() company: CompanyDoc,
        @Body()
        body: CompanySignUpDto
    ): Promise<IResponse> {
        try {
            await this.companyService.update(company, body);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return {
            data: { _id: company._id },
        };
    }

    @CompanyAdminInactiveDoc()
    @Response('company.inactive')
    @CompanyAdminUpdateInactiveGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.COMPANY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(CompanyRequestDto)
    @Patch('/update/:company/inactive')
    async inactive(@GetCompany() company: CompanyDoc): Promise<void> {
        try {
            await this.companyService.inactive(company);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @CompanyAdminActiveDoc()
    @Response('company.active')
    @CompanyAdminUpdateActiveGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.COMPANY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(CompanyRequestDto)
    @Patch('/update/:company/active')
    async active(@GetCompany() company: CompanyDoc): Promise<void> {
        try {
            await this.companyService.active(company);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @CompanyAdminImportDoc()
    @Response('company.import')
    @UploadFileSingle('file')
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.COMPANY,
        action: [
            ENUM_POLICY_ACTION.READ,
            ENUM_POLICY_ACTION.CREATE,
            ENUM_POLICY_ACTION.IMPORT,
        ],
    })
    @AuthJwtAdminAccessProtected()
    @Post('/import')
    async import(
        @UploadedFile(
            FileRequiredPipe,
            FileSizeExcelPipe,
            FileTypeExcelPipe,
            FileExtractPipe,
            new FileValidationPipe<CompanyImportDto>(CompanyImportDto)
        )
        file: IFileExtract<CompanyImportDto>
    ): Promise<IResponse> {
        try {
            await this.companyService.import(file.dto);
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @CompanyAdminExportDoc()
    @ResponseExcel({
        serialization: CompanyListSerialization,
        fileType: ENUM_HELPER_FILE_TYPE.CSV,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.COMPANY,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.EXPORT],
    })
    @AuthJwtAdminAccessProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/export')
    async export(): Promise<IResponse> {
        const companys: ICompanyEntity[] = await this.companyService.findAll({});

        return { data: companys };
    }

    // @CompanyAdminBlockedDoc()
    // @Response('company.blocked')
    // @CompanyAdminUpdateBlockedGuard()
    // @PolicyAbilityProtected({
    //     subject: ENUM_POLICY_SUBJECT.COMPANY,
    //     action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    // })
    // @AuthJwtAdminAccessProtected()
    // @RequestParamGuard(CompanyRequestDto)
    // @Patch('/update/:company/blocked')
    // async blocked(@GetCompany() company: CompanyDoc): Promise<void> {
    //     try {
    //         await this.companyService.blocked(company);
    //     } catch (err: any) {
    //         throw new InternalServerErrorException({
    //             statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
    //             message: 'http.serverError.internalServerError',
    //             _error: err.message,
    //         });
    //     }

    //     return;
    // }
}
