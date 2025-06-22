import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDocumentDto } from './dto/document-dto';
import { CommonService } from '../common/services/common-services';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private readonly commonService: CommonService,
  ) {}
  async findAll(userId: number) {
    if (!userId) {
      throw new BadRequestException('Invalid Parameter');
    }
    const result: Array<any> = await this.prisma.documents.findMany({
      where: {
        userId,
      },
    });
    if (!result?.length) {
      throw new NotFoundException('record not found');
    }
    return result;
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Invalid Parameter');
    }
    const result: any = await this.prisma.documents.findFirst({
      where: {
        id,
      },
    });
    if (!result) {
      throw new NotFoundException('record not found');
    }
    return result;
  }
  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
    file?: Express.Multer.File,
  ) {
    let fileData;
    const { name } = updateDocumentDto;
    if (!id) {
      throw new BadRequestException('Invalid Parameter');
    }
    if (file) {
      // Ensure upload directory exists
      fileData = await this.commonService.uploadFile(file);
    }
    const result: any = await this.prisma.documents.update({
      where: {
        id,
      },
      data: {
        name: name?.trim() || undefined,
        ...(fileData?.statusCode === HttpStatus.OK && { ...fileData.data }),
      },
    });
    if (!result) {
      throw new NotFoundException('record not found');
    }
    return result;
  }

  async create(
    userId: number,
    updateDocumentDto: UpdateDocumentDto,
    file: Express.Multer.File,
  ) {
    let fileData;
    const { name } = updateDocumentDto;
    if (!userId || !name?.trim() || !file) {
      throw new BadRequestException('Invalid Parameter');
    }
    if (file) {
      // Ensure upload directory exists
      fileData = await this.commonService.uploadFile(file);
    }
    if (fileData?.statusCode !== HttpStatus.OK) {
      throw new BadRequestException('something went wrong');
    }
    const result = await this.prisma.documents.create({
      data: {
        name: name?.trim(),
        userId: userId,
        ...fileData.data,
      },
    });
    if (!result) {
      throw new BadRequestException('something went wrong');
    }
    return result;
  }
  async delete(id: number) {
    if (!id) {
      throw new BadRequestException('Invalid Parameter');
    }
    const result = await this.prisma.documents.delete({
      where: {
        id,
      },
    });
    if (!result) {
      throw new NotFoundException('record not found');
    }
    return {
      message: 'success',
      statusCode: 200,
    };
  }
}
