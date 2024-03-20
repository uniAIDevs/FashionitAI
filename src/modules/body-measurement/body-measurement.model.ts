import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'body_measurements' })
export class BodyMeasurementModel extends Document {


  @Prop({type:Types.Decimal128, required:true})
  height: number;

  @Prop({type:Types.Decimal128, required:true})
  weight: number;

  @Prop({type:Types.Decimal128})
  chestSize: number;

  @Prop({type:Types.Decimal128})
  waistSize: number;

  @Prop({type:Types.Decimal128})
  hipSize: number;

  @Prop({type:Date, default:Date.now, select:false})
  createdAt: Date;

  @Prop({type:Date, default:Date.now, select:false})
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'UserModel', select: false })
  user: Types.ObjectId;

}

export const BodyMeasurementSchema = SchemaFactory.createForClass(BodyMeasurementModel);
