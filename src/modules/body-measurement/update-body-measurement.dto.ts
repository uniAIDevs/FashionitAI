import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDate, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class UpdateBodyMeasurementDto {


  @ApiProperty({ required: false })
  @IsOptional()
  @IsDecimal()
  height?: number;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsDecimal()
  weight?: number;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsDecimal()
  chestSize?: number;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsDecimal()
  waistSize?: number;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsDecimal()
  hipSize?: number;
    

  

  
}
