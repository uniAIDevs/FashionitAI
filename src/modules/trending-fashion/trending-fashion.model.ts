import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'trending_fashions' })
export class TrendingFashionModel extends Document {


  @Prop({type:Date})
  trendStartDate: Date;

  @Prop({type:Date})
  trendEndDate: Date;

  @Prop()
  trendDescription: string;

  @Prop({type:Date, default:Date.now, select:false})
  createdAt: Date;

  @Prop({type:Date, default:Date.now, select:false})
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'ClothingDesignModel' })
  design: Types.ObjectId;

}

export const TrendingFashionSchema = SchemaFactory.createForClass(TrendingFashionModel);
