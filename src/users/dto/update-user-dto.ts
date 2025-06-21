import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: '',
    minLength: 2,
    maxLength: 30,
    type: String,
    example: '',
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    description: '',
    minLength: 6,
    type: String,
    example: '',
  })
  password: string;

  @ApiProperty({
    description: '',
    type: String,
    example: '',
  })
  @IsString()
  @IsEmail()
  email: string;
}
