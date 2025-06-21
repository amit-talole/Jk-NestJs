import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    example: 'John',
  })
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  firstName: string;

  @ApiProperty({
    example: 'doe',
  })
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  lastName: string;

  @ApiProperty({
    description: '',
    type: String,
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    minLength: 6,
    type: String,
    example: '',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
