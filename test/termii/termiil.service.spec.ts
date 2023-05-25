// import { TermiiService } from 'src/common/termii/services/termii.service';


//     // Tests that a token is successfully sent.



  

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TermiiService } from 'src/common/termii/services/termii.service';
import { TermiiRepository } from 'src/common/termii/repository/repositories/termii.repository';
import { TermiiCreateDto, TermiiVerifyDto } from 'src/common/termii/dtos/termii.create.dto';

describe('TermiiService', () => {
  let service: TermiiService;
  let configService: ConfigService;
  let termiiRepository: TermiiRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TermiiService,
        { provide: ConfigService, useValue: {} }, // here you can mock your ConfigService
        { provide: TermiiRepository, useValue: {} }, // here you can mock your TermiiRepository
      ],
    }).compile();

    service = module.get<TermiiService>(TermiiService);
    configService = module.get<ConfigService>(ConfigService);
    termiiRepository = module.get<TermiiRepository>(TermiiRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("test_send_token_successfully", async () => {
      // Arrange
      const mobileNumber = "1234567890";
      const termiiRepository = new TermiiRepository(null);
      const configService: any = {
          get: jest.fn().mockReturnValueOnce("test_url")
              .mockReturnValueOnce("test_key")
              .mockReturnValueOnce("test_sender_id")
              .mockReturnValueOnce("test_channel")

      };
      const termiiService = new TermiiService(termiiRepository, configService);

      // Act
      const result = await termiiService.sendToken({ mobileNumber });

      // Assert
      expect(result.phone).toEqual(mobileNumber);
      expect(result.pin).toBeDefined();
      expect(result.pinId).toBeDefined();
  });

  // Tests that an error is thrown when an invalid mobile number is provided.
  it("test_send_token_invalid_mobile_number", async () => {
      // Arrange
      const mobileNumber = "invalid_number";
      const termiiRepository = new TermiiRepository(null);
      const configService: any = {
          get: jest.fn().mockReturnValueOnce("test_url")
              .mockReturnValueOnce("test_key")
              .mockReturnValueOnce("test_sender_id")
              .mockReturnValueOnce("test_channel")
      };
      const termiiService = new TermiiService(termiiRepository, configService);

      // Act & Assert
      await expect(termiiService.sendToken({ mobileNumber })).rejects.toThrowError();
  });

  // Tests that an error is thrown when an invalid API key is provided.
  it("test_send_token_invalid_api_key", async () => {
      // Arrange
      const mobileNumber = "1234567890";
      const termiiRepository = new TermiiRepository(null);
      const configService : any = {
          get: jest.fn().mockReturnValueOnce("test_url")
              .mockReturnValueOnce(null)
              .mockReturnValueOnce("test_sender_id")
              .mockReturnValueOnce("test_channel")
      };
      const termiiService = new TermiiService(termiiRepository, configService);

      // Act & Assert
      await expect(termiiService.sendToken({ mobileNumber })).rejects.toThrowError();
  });

  // Tests that an error is thrown when an invalid pin type is provided.


  // Tests that an error is thrown when verifying a non-existent token.
  it("test_verify_nonexistent_token", async () => {
      // Arrange
      const token = "invalid_token";
      const termiiRepository = new TermiiRepository(null);
      const configService : any= {
          get: jest.fn().mockReturnValueOnce("test_url")
              .mockReturnValueOnce("test_key")
              .mockReturnValueOnce("test_sender_id")
              .mockReturnValueOnce("test_channel")
      };
      const termiiService = new TermiiService(termiiRepository, configService);

      // Act & Assert
      await expect(termiiService.verifyToken({ token })).rejects.toThrowError();
  });

  // Tests that an error is thrown when an invalid API key is provided when verifying a token.
  it("test_verify_token_invalid_api_key", async () => {
      // Arrange
      const token = "valid_token";
      const termiiRepository = new TermiiRepository(null);
      const configService :any = {
          get: jest.fn().mockReturnValueOnce("test_url")
              .mockReturnValueOnce(null)
              .mockReturnValueOnce("test_sender_id")
              .mockReturnValueOnce("test_channel")
      };
      const termiiService = new TermiiService(termiiRepository, configService);
      const id = { pinId: "valid_pin_id" };
      jest.spyOn(termiiRepository, "findOne").mockResolvedValueOnce(id);

      // Act & Assert
      await expect(termiiService.verifyToken({ token })).rejects.toThrowError();
  });
 
});
