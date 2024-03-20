import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDate, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class UpdateTrendingFashionDto {


  @ApiProperty({ required: false })
  @IsOptional()
  designId?: string;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  trendStartDate?: Date;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  trendEndDate?: Date;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  trendDescription?: string;
    

  

  
}
