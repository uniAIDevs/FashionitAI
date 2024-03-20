import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDateString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class CreateBodyMeasurementDto {
  

  @ApiProperty()
  @IsDecimal()
  @IsNotEmpty()
  height: number;
  
  

  @ApiProperty()
  @IsDecimal()
  @IsNotEmpty()
  weight: number;
  
  

  @ApiProperty()
  @IsDecimal()
  @IsOptional()
  chestSize?: number;
  
  

  @ApiProperty()
  @IsDecimal()
  @IsOptional()
  waistSize?: number;
  
  

  @ApiProperty()
  @IsDecimal()
  @IsOptional()
  hipSize?: number;
  
  

  

}
