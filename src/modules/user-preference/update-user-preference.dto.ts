import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDate, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class UpdateUserPreferenceDto {


  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preferredColors?: string;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preferredStyles?: string;
    


  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preferredMaterials?: string;
    

  

  
}
