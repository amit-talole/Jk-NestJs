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
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com',
        password: 'test',
      };
      const result = { id: 1, username: 'test' };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      const response = await controller.register(createAuthDto);

      expect(authService.register).toHaveBeenCalledWith(createAuthDto);
      expect(response).toEqual(result);
    });
  });
});
