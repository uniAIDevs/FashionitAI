import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'user_preferences' })
export class UserPreferenceModel extends Document {


  @Prop()
  preferredColors: string;

  @Prop()
  preferredStyles: string;

  @Prop()
  preferredMaterials: string;

  @Prop({type:Date, default:Date.now, select:false})
  createdAt: Date;

  @Prop({type:Date, default:Date.now, select:false})
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'UserModel', select: false })
  user: Types.ObjectId;

}

export const UserPreferenceSchema = SchemaFactory.createForClass(UserPreferenceModel);
