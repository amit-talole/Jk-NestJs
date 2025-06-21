import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '',
    type: String,
    example: '',
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
