import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
// import { DriverService } from 'sre'; // your driver service path here
import { DriverService } from '../services/driver.service';

@Injectable()
export class DriverRequest implements CanActivate {
    constructor(private readonly driverService: DriverService) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const driver = await this.driverService.findOneByUserId(user.id);

        if (!driver) {
            throw new UnauthorizedException('You must be a driver to access this endpoint');
        }
        request.driver = driver;
        return true;
    }
}
