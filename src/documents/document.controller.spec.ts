import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './ documents.controller';
import { NotFoundException } from '@nestjs/common';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let docService: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    docService = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call docService.findAll with correct parameters', async () => {
      jest.spyOn(docService, 'findAll');
      const mockUser: any = {
        id: 123,
      };
      const response = await controller.findAll(mockUser);
      expect(docService.findAll).toHaveBeenCalledWith(mockUser.id);
      expect(response);
    });
  });

  describe('findOne', () => {
    it('should call docService.findOne with correct parameters', async () => {
      const id = 2;
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
      jest.spyOn(docService, 'findOne').mockResolvedValue(result);

      const response = await controller.findOne(id);
      expect(docService.findOne).toHaveBeenCalledWith(id);
      expect(response).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should call docService.findOne with not found parameters', async () => {
      const id = 6588888;
      const result = {
        message: 'user not found',
        statusCode: 400,
      };
      jest.spyOn(docService, 'findOne').mockResolvedValue(result);

      const response = await controller.findOne(id);
      expect(docService.findOne).toHaveBeenCalledWith(id);
      expect(response).toEqual(result);
    });
  });

  describe('update', () => {
    it('should call docService.update with correct parameters', async () => {
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
      jest.spyOn(docService, 'update').mockResolvedValue(result);
      const response = await controller.update(id, file, payload);
      expect(docService.update).toHaveBeenCalledWith(id, payload, file);
      expect(response).toEqual(result);
    });
  });

  describe('update', () => {
    it('should call docService.update with not found parameters', async () => {
      const id = 6588888;
      const payload = {
        name: 'test',
      };
      const file = null;
      jest
        .spyOn(docService, 'update')
        .mockRejectedValue(new NotFoundException('record not found'));

      await expect(controller.update(id, file, payload)).rejects.toThrow(
        new NotFoundException('record not found'),
      );
      expect(docService.update).toHaveBeenCalledWith(id, payload, file);
    });
  });

  describe('delete', () => {
    it('should call docService.delete with correct parameters', async () => {
      const id = 2;
      const result = {
        message: 'success',
        statusCode: 200,
      };
      jest.spyOn(docService, 'delete').mockResolvedValue(result);
      const response = await controller.delete(id);
      expect(docService.delete).toHaveBeenCalledWith(id);
      expect(response).toEqual(result);
    });
  });

  describe('delete', () => {
    it('should call docService.delete with not found parameters', async () => {
      const id = 6588888;
      jest
        .spyOn(docService, 'delete')
        .mockRejectedValue(new NotFoundException('record not found'));

      await expect(controller.delete(id)).rejects.toThrow(
        new NotFoundException('record not found'),
      );
      expect(docService.delete).toHaveBeenCalledWith(id);
    });
  });
});
