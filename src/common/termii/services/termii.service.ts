import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IDatabaseCreateOptions } from 'src/common/database/interfaces/database.interface';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import {
    TermiiCreateDto, TermiiVerifyDto
} from 'src/common/termii/dtos/termii.create.dto';
import { ITermiiService } from 'src/common/termii/interfaces/termii.service.interface';
import {
    TermiiDoc,
    TermiiEntity,
} from 'src/common/termii/repository/entities/termii.entity';
import { TermiiRepository } from 'src/common/termii/repository/repositories/termii.repository';

@Injectable()
export class TermiiService implements ITermiiService {
    private readonly termii_url: string;
    private readonly termii_api_key: string;
    private readonly termii_sender_id: string;
    private readonly termii_channel: string;

    constructor(
        private readonly termiiRepository: TermiiRepository,
        private readonly configService: ConfigService,

    ) {
        this.termii_url = this.configService.get<string>('termii.url');
        this.termii_api_key = this.configService.get<string>('termii.key');
        this.termii_sender_id = this.configService.get<string>('termii.sender_id');
        this.termii_channel = this.configService.get<string>('termii.channel');
    }

    private async sendRequest(body, endpoint, method = 'GET'): Promise<IResponse> {
        let url = this.termii_url + endpoint;
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
            console.error(err);
            if (err.response && err.response.status === 401) {
                throw new UnauthorizedException('Unauthorized');
            }
            throw err;
        }
    }

    async sendToken({
        mobileNumber,
    }: TermiiCreateDto, options?: IDatabaseCreateOptions): Promise<TermiiDoc> {
        const create: TermiiEntity = new TermiiEntity();
        const endpoint = 'sms/otp/generate'
        const body = {
            api_key: this.termii_api_key,
            phone_number: mobileNumber,
            pin_attempts: 3,
            pin_time_to_live: 0,
            pin_length: 6,
            pin_type: 'NUMERIC'
        }
        try {
            const request = await this.sendRequest(JSON.stringify(body), endpoint, 'POST');
            if (request.data.status == 'success') {
                create.pin = request.data.data.otp;
                create.pinId = request.data.data.pin_id;
                create.phone = mobileNumber
                return this.termiiRepository.create<TermiiEntity>(create, options);
            }
        } catch (error) {
            throw error;
        }

    }

    async verifyToken({
        token
    }: TermiiVerifyDto): Promise<any> {
        const id = await this.termiiRepository.findOne({ pin: token })
        if (!id) {
            throw new NotFoundException('Token not found');
        }
        const endpoint = 'sms/otp/verify'
        const body = {
            api_key: this.termii_api_key,
            pin_id: id.pinId,
            pin: token
        }
        try {
            const request = await this.sendRequest(JSON.stringify(body), endpoint, 'POST');
            if (request.data.verified == 'true') {
                return
            }
        } catch (error) {
            throw error;
        }
    }
}
