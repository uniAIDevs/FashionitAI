import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDate, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class UpdateClothingDesignDto {


  @ApiProperty({ required: false })
  @IsOptional()
  designName?: string;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsDecimal()
  price?: number;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isVirtual?: boolean;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isCustomizable?: boolean;
    


  @ApiProperty({ required: false })
  @IsOptional()
  gender?: string;
    

  

  
}
