import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { YouVerifyServiceInterface } from 'src/common/you-verify/interfaces/you-verify.service.interface';
import { VerifyLicenseDto } from 'src/common/you-verify/dtos/verify-license.dto';

@Injectable()
export class YouVerifyService implements YouVerifyServiceInterface {
  private readonly you_verify_url: string;
  private readonly you_verify_api_key: string;

  constructor(private readonly configService: ConfigService) {
    this.you_verify_url = this.configService.get<string>('youverify.url');
    this.you_verify_api_key = this.configService.get<string>('youverify.key');
}

  private async sendRequest(body, endpoint, method = 'GET') {
    let url = this.you_verify_url + endpoint;
    const options: any = {
      headers: { 'Content-Type': ['application/json', 'application/json'] },
    };

    if (method !== 'GET') {
      options.data = body;
      options.method = method;
    } else {
      url += '?' + new URLSearchParams(body).toString();
    }
    try {
      const request = await axios(url, options);
      return request
    } catch (err) {
      if (err.response && err.response.status === 401) {
        throw new UnauthorizedException('Unauthorized');
      }
      throw err;
    }
  }

  async verifyLicense(verifyLicense : VerifyLicenseDto) {
    const { id } = verifyLicense;
    const endpoint = 'identity/ng/drivers-license'
    const body = {
        id: "AAA00000aa00",
        metadata : {
            requestId: id
        },
        isSubjectConsent : true
    }
    try {
      await this.sendRequest(JSON.stringify(body), endpoint, 'POST');
      return
    } catch (err) {
      throw err;
    }
  }
}
