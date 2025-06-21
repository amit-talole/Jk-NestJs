import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/LoginDto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            AdminRegisterAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add the following test case to the AuthController test suite
  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      const loginDto: LoginDto = { email: 'test', password: 'test' };
      const result = { accessToken: 'token' };
      jest.spyOn(authService, 'login').mockResolvedValue(result);

      const response = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(response).toEqual(result);
    });
  });

  // Add the following test case to the AuthController test suite
  describe('register', () => {
    it('should call AuthService.register with correct parameters', async () => {
      const createAuthDto: CreateAuthDto = {
        firstName: 'John',
        lastName: 'doe',
        email: 'test487784@example.com',
        password: 'test123',
      };
      const result = {
        data: {
          id: 1,
          firstName: 'John',
          lastName: 'doe',
          role: 'editor',
          email: 'test487784@example.com',
        },
        message: 'Sucesss',
        statusCode: 200,
      };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      const response = await controller.register(createAuthDto);

      expect(authService.register).toHaveBeenCalledWith(
        createAuthDto,
        'editor',
      );
      expect(response).toEqual(result);
    });
  });

  describe('AdminRegister', () => {
    it('should call AuthService.register with correct parameters', async () => {
      const createAuthDto: CreateAuthDto = {
        firstName: 'John',
        lastName: 'doe',
        email: 'test487784@example.com',
        password: 'test123',
      };
      const result = {
        data: {
          id: 1,
          firstName: 'John',
          lastName: 'doe',
          role: 'admin',
          email: 'test487784@example.com',
        },
        message: 'Sucesss',
        statusCode: 200,
      };
      jest.spyOn(authService, 'AdminRegisterAsync').mockResolvedValue(result);

      const response = await controller.AdminRegister(createAuthDto);

      expect(authService.AdminRegisterAsync).toHaveBeenCalledWith(
        createAuthDto,
        'admin',
      );
      expect(response).toEqual(result);
    });
  });
});
