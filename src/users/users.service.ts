import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { user, user_role_enum } from '@prisma/client';
import { UserToken } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    return this.prisma.user.create({
      data: {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: createUserDto.password,
        role: user_role_enum[createUserDto.role],
      },
    });
  }

  async findAll(): Promise<any[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });
  }

  async findOne(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });
    if (!user) {
      return {
        message: 'user not found',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }
    return user;
  }

  async findUniqueByEmail(email: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        password: true,
      },
    });
  }

  async createUser(data: CreateUserDto): Promise<user> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    const { firstName, lastName, password, role, email } = updateUserDto;
    const result = await this.prisma.user.update({
      where: { id },
      data: {
        firstName: firstName?.trim() || undefined,
        lastName: lastName?.trim() || undefined,
        password: password?.trim() || undefined,
        role: role?.trim() ? user_role_enum[role] : undefined,
        email: email?.trim() || undefined,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return result;
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} has been successfully deleted` };
  }
  async findByToken(token: string): Promise<UserToken | null> {
    return this.prisma.user_tokens.findFirst({
      where: { refreshToken: token },
    });
  }
  async upsertRefreshToken(token: string, userId: number): Promise<any> {
    return this.prisma.user_tokens.upsert({
      create: {
        userId: userId,
        refreshToken: token,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      update: {
        refreshToken: token,
        updatedAt: new Date(),
      },
      where: {
        userId,
      },
    });
  }
  async deleteRefreshToken(userId: number) {
    try {
      const result = await this.prisma.user_tokens.delete({
        where: {
          userId,
        },
      });
      if (result) {
        return {
          message: 'sucess',
          statusCode: HttpStatus.OK,
        };
      }
    } catch (error) {
      if (error?.code === 'P2025') {
        return {
          message: 'sucess',
          statusCode: HttpStatus.OK,
        };
      }
    }
  }
}
