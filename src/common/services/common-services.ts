/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { extname } from 'path';

@Injectable()
export class CommonService {
  hashPassword(password: string): Promise<string> {
    const SALT = 10;
    return bcrypt.hash(password, SALT);
  }

  comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async uploadFile(file?: Express.Multer.File) {
    try {
      let filePath: string | undefined;
      let type: string | undefined;
      let originalName: string | undefined;
      const uploadPath = './uploads';

      // Ensure upload directory exists
      if (!existsSync(uploadPath)) {
        await mkdir(uploadPath, { recursive: true });
      }

      // Generate unique filename
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      filePath = `${uploadPath}/${uniqueName}`;

      type = file.mimetype.split('/')[1];
      originalName = file.originalname;

      // Save file
      await writeFile(filePath, file.buffer);

      return {
        data: { link: filePath, type, originalName },
        message: 'Sucesss',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
