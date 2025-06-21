import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CommonService } from '../common/services/common-services';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy, CommonService],
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: 'a-weird-unsecret-secret£$%&/()=?',
      signOptions: {
        expiresIn: '2d',
      },
    }),
  ],
})
export class AuthModule {}
