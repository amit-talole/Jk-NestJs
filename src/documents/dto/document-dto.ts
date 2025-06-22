import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateDocumentDto {
  @ApiProperty({
    example: 'test',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
