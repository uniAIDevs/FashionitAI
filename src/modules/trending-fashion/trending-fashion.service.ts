import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types, UpdateQuery } from 'mongoose';
import { convertArrayToObject, getPipelineStageForPagination } from 'src/shared/utils/common'
import { TrendingFashionModel } from './trending-fashion.model';
import { CreateTrendingFashionDto } from './create-trending-fashion.dto';
import { UpdateTrendingFashionDto } from './update-trending-fashion.dto';

@Injectable()
export class TrendingFashionService {
  constructor(
    @InjectModel(TrendingFashionModel.name)
    private readonly trendingFashionModel: Model<TrendingFashionModel>,
  ) {}

  /**
   * Retrieve a paginated list of trendingFashions.
   *
   *
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: TrendingFashionModel[]; total: number }>} - The list of trendingFashions and the total count.
   */
  async getAllTrendingFashions(
    
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: TrendingFashionModel[]; total: number }> {
    try {
      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'clothing_designs',
            localField: 'design', // Replace 'postId' with the field that represents the post ID in CommentModel
            foreignField: '_id',
            as: 'design',
          },
        },
        {
          $unwind: {
            path: '$design',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            trendStartDate: 1,
                        trendEndDate: 1,
                        trendDescription: 1,
                        design: {
              _id: '$design._id',
              designName: '$design.designName',
            },
          },
        },
      ];

      if (searchTerm) {
        // Add a $match stage to filter results based on searchTerm
        pipeline.push({
          $match: {
            $or: [
              { trendStartDate: { $regex: searchTerm, $options: 'i' } },
                            { trendEndDate: { $regex: searchTerm, $options: 'i' } },
                            { trendDescription: { $regex: searchTerm, $options: 'i' } },
                            { 'design.designName': { $regex: searchTerm, $options: 'i' } },
              // Add more fields as needed
            ],
          },
        });
      }

      pipeline.push(...getPipelineStageForPagination(skip, take))

      const [result] = await this.trendingFashionModel.aggregate(pipeline);

      // Extract the total count and matched documents from the aggregation result
      const total = result ? result.total : 0;
      const matchedComments = result ? result.result : [];

      return { result: matchedComments, total };

    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a trendingFashion by ID.
   *
   *
   * @param {string} id - The id of the trendingFashion to retrieve.
   * @returns {Promise<TrendingFashionModel>} - The trendingFashion object.
   * @throws {NotFoundException} - If the trendingFashion with the given id is not found.
   */
  async getTrendingFashionById(id: string): Promise<TrendingFashionModel> {
    try {
      const trendingFashion = 
      await this.trendingFashionModel
      .findOne({ _id: new Types.ObjectId(id),  })
      .populate(
        [
          'design',
        ]
      )
      .exec();
      if (!trendingFashion) {
        throw new NotFoundException('TrendingFashionModel not found');
      }
      return trendingFashion;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new trendingFashion.
   *
   *
   * @param {CreateTrendingFashionDto} createTrendingFashionDto - The DTO for creating a trendingFashion.
   * @returns {Promise<TrendingFashionModel>} - The newly created trendingFashion object.
   */
  async createTrendingFashion(createTrendingFashionDto: CreateTrendingFashionDto): Promise<TrendingFashionModel> {
    try {
      const trendingFashion = new this.trendingFashionModel({
        trendStartDate: createTrendingFashionDto.trendStartDate,
                trendEndDate: createTrendingFashionDto.trendEndDate,
                trendDescription: createTrendingFashionDto.trendDescription,
                design: new Types.ObjectId(createTrendingFashionDto.designId),
        
      });
      return trendingFashion.save();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing trendingFashion.
   *
   *
   * @param {string} id - The id of the trendingFashion to update.
   * @param {UpdateTrendingFashionDto} updateTrendingFashionDto - The DTO for updating a trendingFashion.
   * @returns {Promise<TrendingFashionModel>} - The updated trendingFashion object.
   * @throws {NotFoundException} - If the trendingFashion with the given id is not found.
   */
  async updateTrendingFashion(id: string, updateTrendingFashionDto: UpdateTrendingFashionDto): Promise<TrendingFashionModel> {
    try {

      //TODO: Fix update
      const trendingFashion = await this.getTrendingFashionById(id);

      if (!trendingFashion) {
        throw new NotFoundException(`${this.trendingFashionModel.modelName} not found`);
      }

      // Apply partial updates
      const update: UpdateQuery<TrendingFashionModel> = {};
      for (const field in updateTrendingFashionDto) {
        if (updateTrendingFashionDto.hasOwnProperty(field)) {
          update[field] = updateTrendingFashionDto[field];
        }
      }

      // Save the updated document
      trendingFashion.set(update);
      return trendingFashion.save();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a trendingFashion by its ID.
   *
   *
   * @param {string} id - The id of the trendingFashion to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the trendingFashion with the given ID is not found.
   */
  async deleteTrendingFashion(id: string): Promise<void> {
    try {
      const trendingFashion = await this.getTrendingFashionById(id);
      await trendingFashion.deleteOne();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find trendingFashion data for dropdowns with optional filtering.
   *
   *
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - The keyword for filtering data.
   * @returns {Promise<TrendingFashionEntity[]>} - The list of trendingFashion data for dropdowns.
   */
  async findAllDropdownData(fields: string[], keyword: string): Promise<TrendingFashionModel[]> {
    try {
      const select = fields.reduce((obj, field) => {
        obj[field] = 1;
        return obj;
      }, {});

      const whereConditions = fields.map((field) => ({
        [field]: { $regex: new RegExp(keyword, 'i') }, // Case-insensitive search
      }));

      return await this.trendingFashionModel
        .find({  $or: whereConditions })
        .select(select)
        .limit(25)
        .exec();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

   /**
   * Retrieve a paginated list of trendingFashions by clothingDesign.
   *
   *
   * @param {string} designId - The designId of the trendingFashion to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: TrendingFashionModel[]; total: number }>} - The list of trendingFashions and the total count.
   */
  async getTrendingFashionsByDesignId(
    
    designId: string,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: TrendingFashionModel[]; total: number }> {
    try {
      const pipeline: PipelineStage[] = [
        
        {
          $match: {
            design: new Types.ObjectId(designId),
          },
        },
        {
          $project: {
            trendStartDate: 1,
                        trendEndDate: 1,
                        trendDescription: 1,
                      },
        },
      ];

      if (searchTerm) {
        // Add a $match stage to filter results based on searchTerm
        pipeline.push({
          $match: {
            $or: [
              { trendStartDate: { $regex: searchTerm, $options: 'i' } },
                            { trendEndDate: { $regex: searchTerm, $options: 'i' } },
                            { trendDescription: { $regex: searchTerm, $options: 'i' } },
                            // Add more fields as needed
            ],
          },
        });
      }

      pipeline.push(...getPipelineStageForPagination(skip, take))

      const [result] = await this.trendingFashionModel.aggregate(pipeline);

      // Extract the total count and matched documents from the aggregation result
      const total = result ? result.total : 0;
      const matchedComments = result ? result.result : [];

      return { result: matchedComments, total };

    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }
}
