import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { YouVerifyService } from 'src/common/you-verify/services/you-verify.service';
import { VerifyLicenseDto } from 'src/common/you-verify/dtos/verify-license.dto';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('YouVerifyService', () => {
  let service: YouVerifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YouVerifyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => key),
          },
        },
      ],
    }).compile();

    service = module.get<YouVerifyService>(YouVerifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyLicense', () => {
    it('should verify license', async () => {
      const verifyLicenseDto: VerifyLicenseDto = {
        id: 'AAA00000aa00',
      };

      mockedAxios.post.mockResolvedValueOnce({ data: {} });

      await service.verifyLicense(verifyLicenseDto);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.sandbox.youverify.co/v2/api/identity/ng/drivers-license',
        JSON.stringify({
          id: "AAA00000aa00",
          metadata : {
              requestId: verifyLicenseDto.id,
          },
          isSubjectConsent : true,
          api_key: 'fdfadfdfdfdf3ffffdsf'
        }),
        expect.objectContaining({
          headers: { 'Content-Type': ['application/json', 'application/json'] },
        }),
      );
    });

    it('should throw error when axios returns 401', async () => {
      const verifyLicenseDto: VerifyLicenseDto = {
        id: 'AAA00000aa00',
      };

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 401,
        },
      });

      await expect(service.verifyLicense(verifyLicenseDto)).rejects.toThrow('Unauthorized');
    });

    it('should re-throw any other error from axios', async () => {
      const verifyLicenseDto: VerifyLicenseDto = {
        id: 'AAA00000aa00',
      };

      const testError = new Error('Test error');
      mockedAxios.post.mockRejectedValueOnce(testError);

      await expect(service.verifyLicense(verifyLicenseDto)).rejects.toThrow(testError);
    });
  });
});
