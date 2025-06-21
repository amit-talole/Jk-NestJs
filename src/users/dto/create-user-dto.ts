import { user_role_enum } from '@prisma/client';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role: user_role_enum;
}
