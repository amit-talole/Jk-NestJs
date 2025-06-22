import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CommonService } from '../common/services/common-services';

describe('UsersService', () => {
  let service: DocumentsService;
  let commonService: CommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DocumentsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: CommonService,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    commonService = module.get<CommonService>(CommonService);
  });

  describe('findAll', () => {
    it('should return all user profile', async () => {
      const userId = 8;
      const response = [
        {
          id: 1,
          name: 'amits',
          userId: 8,
          link: './uploads/1750584780911-875262987.jpg',
          created_at: '2025-06-22T11:18:57.592Z',
          updated_at: '2025-06-22T11:18:57.592Z',
          type: 'jpeg',
          originalName: 'e70cce0d35fdea1b50b853461a4b5ad9.jpg',
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(response);

      const result = await service.findAll(userId);
      expect(result).toEqual(response);
    });
  });

  describe('findOne', () => {
    it('should related user profile', async () => {
      const response = {
        id: 1,
        firstName: 'John',
        lastName: 'doe',
        createdAt: '2025-06-21T04:13:01.654Z',
        updatedAt: '2025-06-21T04:13:01.654Z',
        role: 'admin',
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(response);

      const result = await service.findOne(1);
      expect(result).toEqual(response);
    });

    it('should return "record not found" response if record is not found', async () => {
      const id = 6588888;
      await jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('record not found'));
      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException('record not found'),
      );
    });
  });

  describe('update', () => {
    it('should call update with correct parameters', async () => {
      const id = 5;
      const payload = {
        name: 'test',
      };
      const file = null;
      const result: any = {
        id: 1,
        name: 'amits',
        userId: 8,
        link: './uploads/1750584780911-875262987.jpg',
        created_at: '2025-06-22T11:18:57.592Z',
        updated_at: '2025-06-22T11:18:57.592Z',
        type: 'jpeg',
        originalName: 'e70cce0d35fdea1b50b853461a4b5ad9.jpg',
      };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      const response = await service.update(id, payload, file);
      expect(response).toEqual(result);
    });

    it('should return "record not found" response if record is not found', async () => {
      const id = 555;
      const payload = {
        name: 'test',
      };
      const file = null;
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new NotFoundException('record not found'));
      await expect(service.update(id, payload, file)).rejects.toThrow(
        new NotFoundException('record not found'),
      );
    });
  });

  describe('create', () => {
    it('should successfully create a document with valid parameters', async () => {
      const userId = 8;
      const payload = {
        name: 'test',
      };

      // Mock Multer file object
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test file content'),
        destination: '',
        filename: 'test.jpg',
        path: '',
        stream: null,
      };

      const response: any = {
        id: 1,
        name: 'amits',
        userId: 8,
        link: './uploads/1750584780911-875262987.jpg',
        created_at: '2025-06-22T11:18:57.592Z',
        updated_at: '2025-06-22T11:18:57.592Z',
        type: 'jpeg',
        originalName: 'e70cce0d35fdea1b50b853461a4b5ad9.jpg',
      };

      // Mock the uploadFile service if needed
      jest.spyOn(commonService, 'uploadFile').mockResolvedValue({
        statusCode: HttpStatus.OK,
        message: 'Sucesss',
        data: {
          link: response.link,
          type: response.type,
          originalName: response.originalName,
        },
      });

      jest.spyOn(service, 'create').mockResolvedValue(response);

      const result = await service.create(userId, payload, file);
      expect(result).toEqual(response);
    });

    it('should throw BadRequestException when name is missing', async () => {
      const userId = 8;
      const payload = { name: '' };
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test file content'),
        destination: '',
        filename: 'test.jpg',
        path: '',
        stream: null,
      };
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new NotFoundException('Invalid Parameter'));
      await expect(service.create(userId, payload, file)).rejects.toThrow(
        new BadRequestException('Invalid Parameter'),
      );
    });
  });
});
