import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class TriggerDto {
  @ApiProperty({
    example: 'test',
  })
  @IsString()
  @IsOptional()
  title?: string;
}
