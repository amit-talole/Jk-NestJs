import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { user, user_role_enum } from '@prisma/client';

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
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUniqueByEmail(email: string): Promise<user | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: CreateUserDto): Promise<user> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} has been successfully deleted` };
  }
}
