import {
    Body,
    ConflictException,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ComapanyUserGetDoc, CompanyUserCreateDoc, CompanyUserUpdateDoc } from 'src/modules/company/docs/company.user.doc';
import {
    AuthJwtAccessProtected,
} from 'src/common/auth/decorators/auth.jwt.decorator';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { GetUser, UserProtected } from 'src/modules/user/decorators/user.decorator';
import { CompanyDoc } from 'src/modules/company/repository/entities/company.entity';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { CompanyService } from 'src/modules/company/services/company.service';
import { CompanySignUpDto } from 'src/modules/company/dtos/company.sign-up.dto';
import { ENUM_COMPANY_STATUS_CODE_ERROR } from 'src/modules/company/constants/company.status-code.constant';
import { GetCompany } from 'src/modules/company/decorators/company.decorator';
import { CompanyRequestDto } from 'src/modules/company/dtos/company.request.dto';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { CompanyRequestGuard } from 'src/modules/company/guards/company.request.guard';
import { ICompanyDoc } from 'src/modules/company/interfaces/company.interface';
import { CompanyGetSerialization } from 'src/modules/company/serializations/company.get.serialization';
import {RoleService} from 'src/modules/role/services/role.service';
@ApiTags('modules.company.user')
@Controller({
    version: '1',
    path: '/user',
})
export class CompanyUserController {
    constructor(
        private readonly userService: UserService,
        private readonly companyService: CompanyService,
        private readonly roleService: RoleService,
    ) {

    }

    @CompanyUserCreateDoc()
    @Response('company.create')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Post('/create')
    async create(
        @Body() body: CompanySignUpDto,
        @GetUser() user: UserDoc
    ): Promise<void> {
        const promises: Promise<any>[] = [
            this.companyService.findOneByUserId(user._id),
            this.roleService.findOneByName('company'),
        ]
        const [userExist, role] = await Promise.all(promises);
        if (userExist) {
            throw new ConflictException({
                statusCode: ENUM_COMPANY_STATUS_CODE_ERROR.COMPANY_EXIST_ERROR,
                message: 'company.error.companyExist',
            });
        }
        try {
            // await this.companyService.create(
            //     {
            //         companyAddress: body.companyAddress,
            //         companyDescription: body.companyDescription,
            //         companyName: body.companyName,
            //         user: user._id
            //     }
            // );
            console.log(role)
            await this.userService.updateRole(user, {
                role: role._id,
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: error.message,
            });
        }
    }


    @CompanyUserUpdateDoc()
    @Response('company.update', {
        serialization: ResponseIdSerialization,
    })
    @AuthJwtAccessProtected()
    @UseGuards(CompanyRequestGuard)
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
            console.log(err);
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }
        return {
            data: { _id: company._id },
        };;
    }


    @ComapanyUserGetDoc()
    @Response('company.get', {
        serialization: CompanyGetSerialization,
    })
    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/')
    async get(
        @GetUser() user: UserDoc
    ): Promise<IResponse> {
        try {
            const companyWithUser: ICompanyDoc = await this.companyService.findOneByUserId(user._id, {
                join : true,
            });
            return { data: companyWithUser.toObject() };
        } catch (error) {
            console.log(user);
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: error.message,
            });
        }

    }
}