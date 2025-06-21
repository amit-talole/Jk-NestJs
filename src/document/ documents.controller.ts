import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  Injectable,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { DocumentsService } from './documents.service';
import { extname } from 'path';

@Controller('users')
export class DocumentsController {}
