import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDateString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class CreateTrendingFashionDto {
  

  @ApiProperty()
  @IsNotEmpty()
  designId: string;
  
  

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  trendStartDate?: Date;
  
  

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  trendEndDate?: Date;
  
  

  @ApiProperty()
  @IsString()
  @IsOptional()
  trendDescription?: string;
  
  

  

}
