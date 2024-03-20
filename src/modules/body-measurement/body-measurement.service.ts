import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types, UpdateQuery } from 'mongoose';
import { convertArrayToObject, getPipelineStageForPagination } from 'src/shared/utils/common'
import { BodyMeasurementModel } from './body-measurement.model';
import { CreateBodyMeasurementDto } from './create-body-measurement.dto';
import { UpdateBodyMeasurementDto } from './update-body-measurement.dto';

@Injectable()
export class BodyMeasurementService {
  constructor(
    @InjectModel(BodyMeasurementModel.name)
    private readonly bodyMeasurementModel: Model<BodyMeasurementModel>,
  ) {}

  /**
   * Retrieve a paginated list of bodyMeasurements for a specific user.
   *
   * @param {string} userId - The ID of the user whose bodyMeasurements to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: BodyMeasurementModel[]; total: number }>} - The list of bodyMeasurements and the total count.
   */
  async getAllBodyMeasurements(
    userId: string,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: BodyMeasurementModel[]; total: number }> {
    try {
      const pipeline: PipelineStage[] = [
        {
          $match: {
            user: new Types.ObjectId(userId),
          },
        },
        {
          $project: {
            height: 1,
                        weight: 1,
                        chestSize: 1,
                        waistSize: 1,
                        hipSize: 1,
                      },
        },
      ];

      if (searchTerm) {
        // Add a $match stage to filter results based on searchTerm
        pipeline.push({
          $match: {
            $or: [
              { height: { $regex: searchTerm, $options: 'i' } },
                            { weight: { $regex: searchTerm, $options: 'i' } },
                            { chestSize: { $regex: searchTerm, $options: 'i' } },
                            { waistSize: { $regex: searchTerm, $options: 'i' } },
                            { hipSize: { $regex: searchTerm, $options: 'i' } },
                            // Add more fields as needed
            ],
          },
        });
      }

      pipeline.push(...getPipelineStageForPagination(skip, take))

      const [result] = await this.bodyMeasurementModel.aggregate(pipeline);

      // Extract the total count and matched documents from the aggregation result
      const total = result ? result.total : 0;
      const matchedComments = result ? result.result : [];

      return { result: matchedComments, total };

    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a bodyMeasurement by ID for a specific user.
   *
   * @param {string} userId - The ID of the user whose bodyMeasurements to retrieve.
   * @param {string} id - The id of the bodyMeasurement to retrieve.
   * @returns {Promise<BodyMeasurementModel>} - The bodyMeasurement object.
   * @throws {NotFoundException} - If the bodyMeasurement with the given id is not found.
   */
  async getBodyMeasurementById(userId: string,id: string): Promise<BodyMeasurementModel> {
    try {
      const bodyMeasurement = 
      await this.bodyMeasurementModel
      .findOne({ _id: new Types.ObjectId(id), user: new Types.ObjectId(userId), })
      .populate(
        [
        ]
      )
      .exec();
      if (!bodyMeasurement) {
        throw new NotFoundException('BodyMeasurementModel not found');
      }
      return bodyMeasurement;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new bodyMeasurement for a specific user.
   *
   * @param {string} userId - The ID of the user whose bodyMeasurements to retrieve.
   * @param {CreateBodyMeasurementDto} createBodyMeasurementDto - The DTO for creating a bodyMeasurement.
   * @returns {Promise<BodyMeasurementModel>} - The newly created bodyMeasurement object.
   */
  async createBodyMeasurement(userId: string,createBodyMeasurementDto: CreateBodyMeasurementDto): Promise<BodyMeasurementModel> {
    try {
      const bodyMeasurement = new this.bodyMeasurementModel({
        height: createBodyMeasurementDto.height,
                weight: createBodyMeasurementDto.weight,
                chestSize: createBodyMeasurementDto.chestSize,
                waistSize: createBodyMeasurementDto.waistSize,
                hipSize: createBodyMeasurementDto.hipSize,
                user: new Types.ObjectId(userId), 
      });
      return bodyMeasurement.save();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing bodyMeasurement for a specific user.
   *
   * @param {string} userId - The ID of the user whose bodyMeasurements to retrieve.
   * @param {string} id - The id of the bodyMeasurement to update.
   * @param {UpdateBodyMeasurementDto} updateBodyMeasurementDto - The DTO for updating a bodyMeasurement.
   * @returns {Promise<BodyMeasurementModel>} - The updated bodyMeasurement object.
   * @throws {NotFoundException} - If the bodyMeasurement with the given id is not found.
   */
  async updateBodyMeasurement(userId: string,id: string, updateBodyMeasurementDto: UpdateBodyMeasurementDto): Promise<BodyMeasurementModel> {
    try {

      //TODO: Fix update
      const bodyMeasurement = await this.getBodyMeasurementById(userId, id);

      if (!bodyMeasurement) {
        throw new NotFoundException(`${this.bodyMeasurementModel.modelName} not found`);
      }

      // Apply partial updates
      const update: UpdateQuery<BodyMeasurementModel> = {};
      for (const field in updateBodyMeasurementDto) {
        if (updateBodyMeasurementDto.hasOwnProperty(field)) {
          update[field] = updateBodyMeasurementDto[field];
        }
      }

      // Save the updated document
      bodyMeasurement.set(update);
      return bodyMeasurement.save();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a bodyMeasurement for a specific user by its ID.
   *
   * @param {string} userId - The ID of the user whose bodyMeasurements to retrieve.
   * @param {string} id - The id of the bodyMeasurement to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the bodyMeasurement with the given ID is not found.
   */
  async deleteBodyMeasurement(userId: string,id: string): Promise<void> {
    try {
      const bodyMeasurement = await this.getBodyMeasurementById(userId,id);
      await bodyMeasurement.deleteOne();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find bodyMeasurement data for dropdowns with optional filtering.
   *
   * @param {string} userId - The ID of the user whose bodyMeasurements to retrieve.
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - The keyword for filtering data.
   * @returns {Promise<BodyMeasurementEntity[]>} - The list of bodyMeasurement data for dropdowns.
   */
  async findAllDropdownData(userId: string,fields: string[], keyword: string): Promise<BodyMeasurementModel[]> {
    try {
      const select = fields.reduce((obj, field) => {
        obj[field] = 1;
        return obj;
      }, {});

      const whereConditions = fields.map((field) => ({
        [field]: { $regex: new RegExp(keyword, 'i') }, // Case-insensitive search
      }));

      return await this.bodyMeasurementModel
        .find({ user: new Types.ObjectId(userId), $or: whereConditions })
        .select(select)
        .limit(25)
        .exec();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

}
