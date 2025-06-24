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
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesEnum } from '../common/enum/role-enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { user as User } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.ts';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateDocumentDto } from './dto/document-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@Controller('document')
@ApiTags('document')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Throttle({ default: { limit: 20, ttl: 1000 } })
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @Roles(RolesEnum.admin, RolesEnum.editor, RolesEnum.viewer)
  async findAll(@CurrentUser() user: User) {
    return this.documentsService.findAll(user?.id);
  }

  @Get(':id')
  @Roles(RolesEnum.admin, RolesEnum.editor, RolesEnum.viewer)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.editor)
  @UseInterceptors(FileInterceptor('file')) // 'file' must match your form field name
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(id, updateDocumentDto, file);
  }

  @Post()
  @Roles(RolesEnum.editor)
  @UseInterceptors(FileInterceptor('file')) // 'file' must match your form field name
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @CurrentUser() user: User,
  ) {
    return this.documentsService.create(user.id, updateDocumentDto, file);
  }

  @Delete(':id')
  @Roles(RolesEnum.editor)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.delete(id);
  }
}
