import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return all user profile', async () => {
      const response = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'doe',
          createdAt: '2025-06-21T04:13:01.654Z',
          updatedAt: '2025-06-21T04:13:01.654Z',
          role: 'admin',
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(response);

      const result = await service.findAll();
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

    it('should return "user not found" response if user is not found', async () => {
      const id = 6588888;
      const response = {
        message: 'user not found',
        statusCode: 400,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(response);
      const result = await service.findOne(id);
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call update with correct parameters', async () => {
      const updateUserDto = {
        email: 'test@example.com',
        name: 'Updated User',
        password: 'newPassword',
      };
      jest
        .spyOn(service, 'update')
        .mockResolvedValue({ id: 1, ...updateUserDto });

      const result = await service.update(1, updateUserDto);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual({ id: 1, ...updateUserDto });
    });

    it('should call update with not found parameters', async () => {
      const id = 555;
      const updateUserDto = {
        email: 'test@example.com',
        name: 'Updated User',
        password: 'newPassword',
      };
      const response = {
        message: 'user not found',
        statusCode: 400,
      };
      jest.spyOn(service, 'update').mockResolvedValue(response);

      const result = await service.update(id, updateUserDto);
      expect(service.update).toHaveBeenCalledWith(id, updateUserDto);
      expect(result).toEqual(response);
    });
  });
});
