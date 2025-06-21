import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/LoginDto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateAuthDto) {
    return this.authService.register(createUserDto, 'editor');
  }
  @Post('admin/register')
  async AdminRegister(@Body() createUserDto: CreateAuthDto) {
    return this.authService.AdminRegisterAsync(createUserDto, 'admin');
  }
}
