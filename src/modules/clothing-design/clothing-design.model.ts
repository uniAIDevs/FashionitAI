import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'clothing_designs' })
export class ClothingDesignModel extends Document {


  @Prop({required:true})
  designName: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop({type:Types.Decimal128})
  price: number;

  @Prop({default:false})
  isVirtual: boolean;

  @Prop({default:false})
  isCustomizable: boolean;

  @Prop()
  gender: string;

  @Prop({type:Date, default:Date.now, select:false})
  createdAt: Date;

  @Prop({type:Date, default:Date.now, select:false})
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'UserModel', select: false })
  user: Types.ObjectId;

}

export const ClothingDesignSchema = SchemaFactory.createForClass(ClothingDesignModel);
