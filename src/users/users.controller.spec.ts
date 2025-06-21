import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
// import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call usersService.findAll with correct parameters', async () => {
      jest.spyOn(usersService, 'findAll');
      const response = await controller.findAll();
      expect(usersService.findAll).toHaveBeenCalledWith();
      expect(response);
    });
  });

  describe('findOne', () => {
    it('should call usersService.findOne with correct parameters', async () => {
      const id = 5;
      const result = {
        id: 5,
        firstName: 'John',
        lastName: 'doe',
        createdAt: '2025-06-21T04:28:49.288Z',
        updatedAt: '2025-06-21T04:28:49.288Z',
        role: 'admin',
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(result);

      const response = await controller.findOne(id);
      expect(usersService.findOne).toHaveBeenCalledWith(id);
      expect(response).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should call usersService.findOne with not found parameters', async () => {
      const id = 6588888;
      const result = {
        message: 'user not found',
        statusCode: 400,
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(result);

      const response = await controller.findOne(id);
      expect(usersService.findOne).toHaveBeenCalledWith(id);
      expect(response).toEqual(result);
    });
  });

  describe('update', () => {
    it('should call usersService.update with correct parameters', async () => {
      const id = 5;
      const payload = {
        firstName: 'john',
        lastName: 'doeass',
      };
      const result = {
        id: 5,
        firstName: 'John',
        lastName: 'doe',
        createdAt: '2025-06-21T04:28:49.288Z',
        updatedAt: '2025-06-21T04:28:49.288Z',
        role: 'admin',
      };
      jest.spyOn(usersService, 'update').mockResolvedValue(result);
      const response = await controller.update(id, payload);
      expect(usersService.update).toHaveBeenCalledWith(id, payload);
      expect(response).toEqual(result);
    });
  });

  describe('update', () => {
    it('should call usersService.update with not found parameters', async () => {
      const id = 6588888;
      const payload = {
        firstName: 'john',
        lastName: 'doeass',
      };
      const result = {
        message: 'user not found',
        statusCode: 400,
      };
      jest.spyOn(usersService, 'update').mockResolvedValue(result);

      const response = await controller.update(id, payload);
      expect(usersService.update).toHaveBeenCalledWith(id, payload);
      expect(response).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should call usersService.remove with correct parameters', async () => {
      const id = 5;
      const result = {
        message: `User with ID ${id} has been successfully deleted`,
      };
      jest.spyOn(usersService, 'remove').mockResolvedValue(result);
      const response = await controller.remove(id);
      expect(usersService.remove).toHaveBeenCalledWith(id);
      expect(response).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should call usersService.remove with not found parameters', async () => {
      const id = 6588888;
      const result = {
        message: `User with ID ${id} not found`,
        error: 'Not Found',
        statusCode: 404,
      };
      jest.spyOn(usersService, 'remove').mockResolvedValue(result);
      const response = await controller.remove(id);
      expect(usersService.remove).toHaveBeenCalledWith(id);
      expect(response).toEqual(result);
    });
  });
});
