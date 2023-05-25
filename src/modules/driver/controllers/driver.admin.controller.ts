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
import { ENUM_DRIVER_STATUS_CODE_ERROR } from 'src/modules/driver/constants/driver.status-code.constant';
import {
    DriverAdminDeleteGuard,
    DriverAdminGetGuard,
    DriverAdminUpdateActiveGuard,
    DriverAdminUpdateGuard,
    DriverAdminUpdateInactiveGuard,
} from 'src/modules/driver/decorators/driver.admin.decorator';
import { GetDriver } from 'src/modules/driver/decorators/driver.decorator';
import { DriverCreateDto } from 'src/modules/driver/dtos/driver.create.dto';
import { DriverImportDto } from 'src/modules/driver/dtos/driver.import.dto';
import { DriverRequestDto } from 'src/modules/driver/dtos/driver.request.dto';
import {
    IDriverDoc,
    IDriverEntity,
} from 'src/modules/driver/interfaces/driver.interface';
import { DriverGetSerialization } from 'src/modules/driver/serializations/driver.get.serialization';
import { DriverListSerialization } from 'src/modules/driver/serializations/driver.list.serialization';
import { DriverService } from 'src/modules/driver/services/driver.service';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
// import { DriverUpdateNameDto } from 'src/modules/driver/dtos/driver.update-name.dto';
import {
    DRIVER_DEFAULT_AVAILABLE_ORDER_BY,
    DRIVER_DEFAULT_AVAILABLE_SEARCH,
    DRIVER_DEFAULT_BLOCKED,
    DRIVER_DEFAULT_INACTIVE_PERMANENT,
    DRIVER_DEFAULT_IS_ACTIVE,
    DRIVER_DEFAULT_ORDER_BY,
    DRIVER_DEFAULT_ORDER_DIRECTION,
    DRIVER_DEFAULT_PER_PAGE,
} from 'src/modules/driver/constants/driver.list.constant';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    PaginationQuery,
    PaginationQueryFilterEqualObjectId,
    PaginationQueryFilterInBoolean,
} from 'src/common/pagination/decorators/pagination.decorator';
import { DriverDoc } from 'src/modules/driver/repository/entities/driver.entity';
import { RoleService } from 'src/modules/role/services/role.service';
import { PolicyAbilityProtected } from 'src/common/policy/decorators/policy.decorator';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_SUBJECT,
} from 'src/common/policy/constants/policy.enum.constant';
import {
    DriverAdminActiveDoc,
    DriverAdminCreateDoc,
    DriverAdminDeleteDoc,
    DriverAdminExportDoc,
    DriverAdminGetDoc,
    DriverAdminImportDoc,
    DriverAdminInactiveDoc,
    DriverAdminListDoc,
    DriverAdminUpdateDoc,
} from 'src/modules/driver/docs/driver.admin.doc';
// import { DriverCreateDto } from 'src/modules/driver/dtos/driver.create.dto';

@ApiTags('modules.admin.driver')
@Controller({
    version: '1',
    path: '/driver',
})
export class DriverAdminController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly driverService: DriverService    ) {}

    @DriverAdminListDoc()
    @ResponsePaging('driver.list', {
        serialization: DriverListSerialization,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.DRIVER,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @AuthJwtAdminAccessProtected()
    @Get('/list')
    async list(
        @PaginationQuery(
            DRIVER_DEFAULT_PER_PAGE,
            DRIVER_DEFAULT_ORDER_BY,
            DRIVER_DEFAULT_ORDER_DIRECTION,
            DRIVER_DEFAULT_AVAILABLE_SEARCH,
            DRIVER_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryFilterInBoolean('isActive', DRIVER_DEFAULT_IS_ACTIVE)
        isActive: Record<string, any>,
        @PaginationQueryFilterInBoolean('blocked', DRIVER_DEFAULT_BLOCKED)
        blocked: Record<string, any>,
        @PaginationQueryFilterInBoolean(
            'inactivePermanent',
            DRIVER_DEFAULT_INACTIVE_PERMANENT
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

        const drivers: IDriverEntity[] = await this.driverService.findAll(find, {
            paging: {
                limit: _limit,
                offset: _offset,
            },
            order: _order,
        });
        const total: number = await this.driverService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            data: drivers,
        };
    }

    @DriverAdminGetDoc()
    @Response('driver.get', {
        serialization: DriverGetSerialization,
    })
    @DriverAdminGetGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.DRIVER,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(DriverRequestDto)
    @Get('/get/:driver')
    async get(@GetDriver() driver: DriverDoc): Promise<IResponse> {
        const driverWithUser: IDriverDoc = await this.driverService.joinWithUser(
            driver
        );
        return { data: driverWithUser.toObject() };
    }

    @DriverAdminCreateDoc()
    @Response('driver.create', {
        serialization: ResponseIdSerialization,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.DRIVER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
    })
    @AuthJwtAdminAccessProtected()
    @Post('/create')
    async create(
        @Body()
        {dateOfBirth,driverLicenceNumber, driverLicenseExpires,user }: DriverCreateDto
    ): Promise<IResponse> {
        const promises: Promise<any>[] = [
            this.driverService.findOneByUserId(user)
        ];
        const [findOneByUserId] = await Promise.all(
            promises
        );
        if (findOneByUserId) {
            throw new NotFoundException({
                statusCode: ENUM_DRIVER_STATUS_CODE_ERROR.DRIVER_EXIST_ERROR,
                message: 'driver.error.exist',
            });
        } 
        try {
            const created: DriverDoc = await this.driverService.create(
                {
                    dateOfBirth,
                    driverLicenceNumber, 
                    driverLicenseExpires,
                    user
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

    @DriverAdminDeleteDoc()
    @Response('driver.delete')
    @DriverAdminDeleteGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.DRIVER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(DriverRequestDto)
    @Delete('/delete/:driver')
    async delete(@GetDriver() driver: DriverDoc): Promise<void> {
        try {
            await this.driverService.delete(driver);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @DriverAdminUpdateDoc()
    @Response('driver.update', {
        serialization: ResponseIdSerialization,
    })
    @DriverAdminUpdateGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.DRIVER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(DriverRequestDto)
    @Put('/update/:driver')
    async update(
        @GetDriver() driver: DriverDoc,
        @Body()
        body: DriverCreateDto
    ): Promise<IResponse> {
        try {
            await this.driverService.update(driver, body);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return {
            data: { _id: driver._id },
        };
    }

    @DriverAdminInactiveDoc()
    @Response('driver.inactive')
    @DriverAdminUpdateInactiveGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.DRIVER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(DriverRequestDto)
    @Patch('/update/:driver/inactive')
    async inactive(@GetDriver() driver: DriverDoc): Promise<void> {
        try {
            await this.driverService.inactive(driver);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @DriverAdminActiveDoc()
    @Response('driver.active')
    @DriverAdminUpdateActiveGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.DRIVER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(DriverRequestDto)
    @Patch('/update/:driver/active')
    async active(@GetDriver() driver: DriverDoc): Promise<void> {
        try {
            await this.driverService.active(driver);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @DriverAdminImportDoc()
    @Response('driver.import')
    @UploadFileSingle('file')
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.DRIVER,
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
            new FileValidationPipe<DriverImportDto>(DriverImportDto)
        )
        file: IFileExtract<DriverImportDto>
    ): Promise<IResponse> {
        try {
            await this.driverService.import(file.dto);
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }

        return;
    }

    @DriverAdminExportDoc()
    @ResponseExcel({
        serialization: DriverListSerialization,
        fileType: ENUM_HELPER_FILE_TYPE.CSV,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.DRIVER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.EXPORT],
    })
    @AuthJwtAdminAccessProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/export')
    async export(): Promise<IResponse> {
        const drivers: IDriverEntity[] = await this.driverService.findAll({});

        return { data: drivers };
    }

    // @DriverAdminBlockedDoc()
    // @Response('driver.blocked')
    // @DriverAdminUpdateBlockedGuard()
    // @PolicyAbilityProtected({
    //     subject: ENUM_POLICY_SUBJECT.DRIVER,
    //     action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    // })
    // @AuthJwtAdminAccessProtected()
    // @RequestParamGuard(DriverRequestDto)
    // @Patch('/update/:driver/blocked')
    // async blocked(@GetDriver() driver: DriverDoc): Promise<void> {
    //     try {
    //         await this.driverService.blocked(driver);
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
