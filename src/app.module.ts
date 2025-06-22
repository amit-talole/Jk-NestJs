import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { DocumentsModule } from './documents/documents.module';
import { IngestionModule } from './ ingestion/ ingestion.module';
import config from './common/configs/config';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    DocumentsModule,
    IngestionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
