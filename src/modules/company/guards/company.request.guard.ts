import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyService } from '../services/company.service';

@Injectable()
export class CompanyRequestGuard implements CanActivate {
  constructor(private readonly companyService: CompanyService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const companyId = request.params.company; 

    // Fetch the company from the DB
    const company = await this.companyService.findOneById(companyId);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Attach company to the request object
    request.__company = company;

    return true;
  }
}
