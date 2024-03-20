import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClothingDesignService } from './clothing-design.service';
import { ClothingDesignController } from './clothing-design.controller';
import { ClothingDesignModel, ClothingDesignSchema } from './clothing-design.model';
import { TrendingFashionModule } from 'src/modules/trending-fashion/trending-fashion.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClothingDesignModel.name, schema: ClothingDesignSchema },
    ]),
    TrendingFashionModule,
  ],
  controllers: [ClothingDesignController],
  providers: [ClothingDesignService],
  exports: [ClothingDesignService],
})
export class ClothingDesignModule {}
