import { Module } from '@nestjs/common';
import { IngestionController } from './ ingestion.controller';
import { IngestionService } from './ingestion.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [IngestionController],
  providers: [IngestionService, PrismaService],
})
export class IngestionModule {}
