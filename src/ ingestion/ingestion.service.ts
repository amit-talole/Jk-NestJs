import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Ingestion } from './entity/ingestion.entity';

@Injectable()
export class IngestionService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async trigger(
    userId: number,
    title: string,
  ): Promise<{ ingestionId: number }> {
    const webhookUrl = this.configService.get('webhookUrl');
    if (!title?.trim()) {
      throw new BadRequestException('Invalid Parameter');
    }
    const ingestion = await this.prisma.ingestion.create({
      data: {
        userId,
        status: 'PENDING',
        title,
        webhookUrl,
      },
    });

    // Start async process
    this.processIngestion(ingestion.id, webhookUrl);
    return { ingestionId: ingestion.id };
  }

  private async processIngestion(id: number, webhookUrl?: string) {
    // Set to IN_PROGRESS
    await this.prisma.ingestion.update({
      where: { id },
      data: { status: 'IN_PROGRESS' },
    });

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await this.prisma.ingestion.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          updated_at: new Date(),
        },
      });

      // Notify webhook if provided
      if (webhookUrl) {
        await axios.post(webhookUrl, {
          ingestionId: id,
          status: 'COMPLETED',
        });
      }
    } catch (err) {
      await this.prisma.ingestion.update({
        where: { id },
        data: {
          status: 'FAILED',
          updated_at: new Date(),
        },
      });

      if (webhookUrl) {
        await axios.post(webhookUrl, {
          ingestionId: id,
          status: 'FAILED',
          error: err.message,
        });
      }
    }
  }

  async getStatus(id: number): Promise<Ingestion | { message: string }> {
    const ingestion = await this.prisma.ingestion.findUnique({ where: { id } });
    return ingestion || { message: 'Ingestion not found' };
  }
}
