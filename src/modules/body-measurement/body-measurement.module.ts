import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BodyMeasurementService } from './body-measurement.service';
import { BodyMeasurementController } from './body-measurement.controller';
import { BodyMeasurementModel, BodyMeasurementSchema } from './body-measurement.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BodyMeasurementModel.name, schema: BodyMeasurementSchema },
    ]),
  ],
  controllers: [BodyMeasurementController],
  providers: [BodyMeasurementService],
  exports: [BodyMeasurementService],
})
export class BodyMeasurementModule {}
