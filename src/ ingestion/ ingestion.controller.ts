import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.ts';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesEnum } from '../common/enum/role-enum';
import { TriggerDto } from './dto/ingestion.dto';
import { user as User } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('ingestion')
@ApiTags('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @Roles(RolesEnum.editor)
  async trigger(@CurrentUser() user: User, @Body() { title }: TriggerDto) {
    return this.ingestionService.trigger(user?.id, title);
  }

  @Get('status/:id')
  @Roles(RolesEnum.editor, RolesEnum.viewer)
  async getStatus(@Param('id', ParseIntPipe) id: number) {
    return this.ingestionService.getStatus(id);
  }
}
