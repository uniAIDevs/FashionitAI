import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrendingFashionService } from './trending-fashion.service';
import { TrendingFashionController } from './trending-fashion.controller';
import { TrendingFashionModel, TrendingFashionSchema } from './trending-fashion.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrendingFashionModel.name, schema: TrendingFashionSchema },
    ]),
  ],
  controllers: [TrendingFashionController],
  providers: [TrendingFashionService],
  exports: [TrendingFashionService],
})
export class TrendingFashionModule {}
