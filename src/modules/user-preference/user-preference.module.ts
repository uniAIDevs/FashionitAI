import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPreferenceService } from './user-preference.service';
import { UserPreferenceController } from './user-preference.controller';
import { UserPreferenceModel, UserPreferenceSchema } from './user-preference.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserPreferenceModel.name, schema: UserPreferenceSchema },
    ]),
  ],
  controllers: [UserPreferenceController],
  providers: [UserPreferenceService],
  exports: [UserPreferenceService],
})
export class UserPreferenceModule {}
