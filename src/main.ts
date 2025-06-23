import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Swagger Config
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS With Postgresql and prisma ORM')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Swagger UI
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Global Pipes
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get('APP_PORT') ?? 3100);
  Logger.log(
    `Application is running on: http://localhost:${configService.get(
      'APP_PORT',
    )}`,
  );
  Logger.log(
    `Application is running on: http://localhost:${configService.get(
      'APP_PORT',
    )}/api`,
  );
}
bootstrap();
