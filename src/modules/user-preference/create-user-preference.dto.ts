import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsDecimal, IsDateString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { IsTimeFormat } from 'src/shared/decorator/validator';

export class CreateUserPreferenceDto {
  

  @ApiProperty()
  @IsString()
  @IsOptional()
  preferredColors?: string;
  
  

  @ApiProperty()
  @IsString()
  @IsOptional()
  preferredStyles?: string;
  
  

  @ApiProperty()
  @IsString()
  @IsOptional()
  preferredMaterials?: string;
  
  

  

}
