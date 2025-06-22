import { Module } from '@nestjs/common';
import { DocumentsController } from './ documents.controller';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { CommonService } from '../common/services/common-services';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, PrismaService, CommonService],
})
export class DocumentsModule {}
