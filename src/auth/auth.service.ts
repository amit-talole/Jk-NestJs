import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/LoginDto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CommonService } from '../common/services/common-services';
import { user as User, user_role_enum } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly commonService: CommonService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUniqueByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await this.commonService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findUniqueByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.commonService.comparePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);
    await this.usersService.upsertRefreshToken(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(createUserDto: CreateAuthDto, role?: string): Promise<any> {
    const existingUser = await this.usersService.findUniqueByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.commonService.hashPassword(
      createUserDto.password,
    );
    const result = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      role: user_role_enum[role] || 'admin',
    });
    if (result) {
      const accessToken = this.generateToken(result);
      const refreshToken = this.generateRefreshToken(result);
      await this.usersService.upsertRefreshToken(refreshToken, result?.id);

      return {
        data: {
          id: result.id,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          role: result.role,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        message: 'Sucesss',
        statusCode: HttpStatus.OK,
      };
    }
  }

  async AdminRegisterAsync(createUserDto: CreateAuthDto, role?: string) {
    return this.register(createUserDto, role);
  }

  async refreshToken(
    refreshToken: string,
    user: any,
  ): Promise<{ refresh_token: string }> {
    const result = await this.usersService.findByToken(refreshToken);
    if (!result) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const response = this.generateRefreshToken(user);
    await this.usersService.upsertRefreshToken(response, user?.sub);

    return {
      refresh_token: response,
    };
  }
  async logout(user: User) {
    return this.usersService.deleteRefreshToken(user.id);
  }
  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });
  }
  private generateRefreshToken(user: User): string {
    const payload = { sub: user.id, email: user.email, role: user.role };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '2 days',
    });
  }
}
