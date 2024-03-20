import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDateString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class CreateClothingDesignDto {
  

  @ApiProperty()
  @IsNotEmpty()
  designName: string;
  
  

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
  
  

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageUrl?: string;
  
  

  @ApiProperty()
  @IsDecimal()
  @IsOptional()
  price?: number;
  
  

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isVirtual?: boolean;
  
  

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isCustomizable?: boolean;
  
  

  @ApiProperty()
  @IsOptional()
  gender?: string;
  
  

  

}
