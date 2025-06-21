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
import { UpdateUserDto } from '../users/dto/update-user-dto';
import { LoginDto } from './dto/LoginDto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CommonService } from '../common/services/common-services';
import { user, user_role_enum } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly commonService: CommonService,
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
    console.log('User retrieved:', user); // Debugging log

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.commonService.comparePassword(
      loginDto.password,
      user.password,
    );
    console.log('Password comparison result:', isPasswordValid); // Debugging log

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
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
      return {
        data: {
          id: result.id,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          role: result.role,
          access_token: accessToken,
        },
        message: 'Sucesss',
        statusCode: HttpStatus.OK,
      };
    }
  }

  async AdminRegisterAsync(createUserDto: CreateAuthDto, role?: string) {
    return this.register(createUserDto, role);
  }

  async getProfile(id: number): Promise<any> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    return this.usersService.update(id, updateUserDto);
  }

  async deleteProfile(id: number): Promise<void> {
    await this.usersService.remove(id);
  }

  async changePassword(id: number, newPassword: string): Promise<any> {
    const hashedPassword = await this.commonService.hashPassword(newPassword);
    const user = await this.usersService.findOne(id);
    const updateUserDto: UpdateUserDto = {
      name: user.username,
      email: user.email,
      password: hashedPassword,
    };
    return this.usersService.update(id, updateUserDto);
  }
  private generateToken(user: user) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
