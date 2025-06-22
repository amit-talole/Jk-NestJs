import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enum/role-enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { user as User } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.ts';
import { ApiTags } from '@nestjs/swagger';
import { UpdateDocumentDto } from './dto/document-dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('document')
@ApiTags('document')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolesEnum.admin)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async findAll(@CurrentUser() user: User) {
    return this.documentsService.findAll(user?.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file')) // 'file' must match your form field name
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(id, updateDocumentDto, file);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file')) // 'file' must match your form field name
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @CurrentUser() user: User,
  ) {
    return this.documentsService.create(user.id, updateDocumentDto, file);
  }
}
