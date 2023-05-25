import { createParamDecorator } from "@nestjs/common/decorators";
import { DriverDoc, DriverEntity } from "../repository/entities/driver.entity";
import { ExecutionContext } from "@nestjs/common";
import { IRequestApp } from "src/common/request/interfaces/request.interface";

export const GetDriver = createParamDecorator(
    (returnPlain: boolean, ctx: ExecutionContext): DriverDoc | DriverEntity => {
        const { __driver } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __driver: DriverDoc }>();
        return returnPlain ? __driver.toObject() : __driver;
    }
);