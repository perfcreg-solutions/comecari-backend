import { Body, ConflictException, Controller, HttpCode, HttpStatus, InternalServerErrorException, Post, UploadedFile, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DriverUserCreateDoc, DriverUserLicenseDto, DriverUserLicenseUploadDoc } from "src/modules/driver/docs/driver.user.doc";
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { GetUser, UserProtected } from "src/modules/user/decorators/user.decorator";
import { AuthJwtAccessProtected } from "src/common/auth/decorators/auth.jwt.decorator";
import { UserService } from "src/modules/user/services/user.service";
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { DriverService } from "../services/driver.service";
import { RoleService } from "src/modules/role/services/role.service";
import { ENUM_DRIVER_STATUS_CODE_ERROR } from "../constants/driver.status-code.constant";
import { ENUM_ERROR_STATUS_CODE_ERROR } from "src/common/error/constants/error.status-code.constant";
import { DriverUserCreateDto } from "../dtos/driver.user-create.dto";
import { DriverLicenseDto } from "../dtos/driver.license.dto";
import { YouVerifyService } from "src/common/you-verify/services/you-verify.service";
import { FileCustomMaxFile, FileCustomMaxSize, UploadFileMultiple } from "src/common/file/decorators/file.decorator";
import { AwsS3Serialization } from "src/common/aws/serializations/aws.s3.serialization";
import { IFile } from "src/common/file/interfaces/file.interface";
import { FileRequiredPipe } from "src/common/file/pipes/file.required.pipe";
import { FileSizeImagePipe } from "src/common/file/pipes/file.size.pipe";
import { FileTypeImagePipe } from "src/common/file/pipes/file.type.pipe";
import { AwsS3Service } from "src/common/aws/services/aws.s3.service";
import { DriverRequest } from "../guards/driver.request.guard";
import { DriverDoc } from "../repository/entities/driver.entity";
import { GetDriver } from "../decorators/driver.decorator";



@ApiTags('modules.driver.user')
@Controller({
    version: '1',
    path: '/user'
})
export class DriverUserController {
    constructor(
        private readonly userService: UserService,
        private readonly driverService: DriverService,
        private readonly roleService: RoleService,
        private readonly youVerifyService: YouVerifyService,
        private readonly awsS3Service: AwsS3Service
    ){
    }

    @DriverUserCreateDoc()
    @Post('/create')
    @Response('driver.create')
    @UserProtected()
    @AuthJwtAccessProtected()
    async create(
        @Body() body: DriverUserCreateDto,
        @GetUser() user: UserDoc
    ): Promise<void>{
        const promises: Promise<any>[] = [
            this.driverService.findOneByUserId(user._id),
            this.roleService.findOneByName('truck_owner'),
        ]

        const [driver, role] = await Promise.all(promises);
        if(driver) {
            throw new ConflictException({
                statusCode: ENUM_DRIVER_STATUS_CODE_ERROR.DRIVER_EXIST_ERROR,
                message: 'driver.error.exist',
            });
        }
        try {
            await this.driverService.create({
                driverLicenceNumber: body.driverLicenceNumber,
              driverLicenseExpires: body.driverLicenseExpires,
              dateOfBirth: body.dateOfBirth,
              user: user._id
            })
            await this.userService.updateRole(user, {
                role: role._id,
            });
        } catch (error) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: error.message,
            });
        }
    }


    @DriverUserLicenseDto()
    @Post('/verify-licence')
    @Response('driver.verifyLicence')
    @UserProtected()
    @AuthJwtAccessProtected()
    async verifyLicence(
        @Body() body: DriverLicenseDto
    ):Promise<void>{
        try {
            await this.youVerifyService.verifyLicense({
                id: body.driverLicenceNumber
            });
        } catch (error) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: error.message,
            });
        }
    }

    @DriverUserLicenseUploadDoc()
    @Response('driver.licenseUpload')
    @UserProtected()
    @AuthJwtAccessProtected()
    @UploadFileMultiple('file')
    @FileCustomMaxFile(4)
    @UseGuards(DriverRequest)
    @HttpCode(HttpStatus.OK)
    @FileCustomMaxSize('1m')
    @Post('/license/upload')
    async upload(
        @GetDriver() driver: DriverDoc,
        @UploadedFile(FileRequiredPipe, FileSizeImagePipe, FileTypeImagePipe)
        files: IFile[]
    ): Promise<void> {
        for (const file of files) {
            const filename: string = file.originalname;
            const content: Buffer = file.buffer;
            const mime: string = filename
                .substring(filename.lastIndexOf('.') + 1, filename.length)
                .toLowerCase();
            const path = await this.driverService.createPhotoFilename();
            try {
                const aws: AwsS3Serialization =
                    await this.awsS3Service.putItemInBucket(
                        `${path.filename}.${mime}`,
                        content,
                        {
                            path: `${path.path}/${driver._id}`,
                        }
                    );

                    this.driverService.updatePhoto(driver, aws)


                
            } catch (err: any) {
                throw new InternalServerErrorException({
                    statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                    message: 'http.serverError.internalServerError',
                    _error: err.message,
                });
            }
        }

        return;
    }
}

