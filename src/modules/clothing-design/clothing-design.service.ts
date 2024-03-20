import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types, UpdateQuery } from 'mongoose';
import { convertArrayToObject, getPipelineStageForPagination } from 'src/shared/utils/common'
import { ClothingDesignModel } from './clothing-design.model';
import { CreateClothingDesignDto } from './create-clothing-design.dto';
import { UpdateClothingDesignDto } from './update-clothing-design.dto';

@Injectable()
export class ClothingDesignService {
  constructor(
    @InjectModel(ClothingDesignModel.name)
    private readonly clothingDesignModel: Model<ClothingDesignModel>,
  ) {}

  /**
   * Retrieve a paginated list of clothingDesigns for a specific user.
   *
   * @param {string} userId - The ID of the user whose clothingDesigns to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: ClothingDesignModel[]; total: number }>} - The list of clothingDesigns and the total count.
   */
  async getAllClothingDesigns(
    userId: string,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: ClothingDesignModel[]; total: number }> {
    try {
      const pipeline: PipelineStage[] = [
        {
          $match: {
            user: new Types.ObjectId(userId),
          },
        },
        {
          $project: {
            designName: 1,
                        description: 1,
                        imageUrl: 1,
                        price: 1,
                        isVirtual: 1,
                        isCustomizable: 1,
                        gender: 1,
                      },
        },
      ];

      if (searchTerm) {
        // Add a $match stage to filter results based on searchTerm
        pipeline.push({
          $match: {
            $or: [
              { designName: { $regex: searchTerm, $options: 'i' } },
                            { description: { $regex: searchTerm, $options: 'i' } },
                            { imageUrl: { $regex: searchTerm, $options: 'i' } },
                            { price: { $regex: searchTerm, $options: 'i' } },
                            { isVirtual: { $regex: searchTerm, $options: 'i' } },
                            { isCustomizable: { $regex: searchTerm, $options: 'i' } },
                            { gender: { $regex: searchTerm, $options: 'i' } },
                            // Add more fields as needed
            ],
          },
        });
      }

      pipeline.push(...getPipelineStageForPagination(skip, take))

      const [result] = await this.clothingDesignModel.aggregate(pipeline);

      // Extract the total count and matched documents from the aggregation result
      const total = result ? result.total : 0;
      const matchedComments = result ? result.result : [];

      return { result: matchedComments, total };

    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a clothingDesign by ID for a specific user.
   *
   * @param {string} userId - The ID of the user whose clothingDesigns to retrieve.
   * @param {string} id - The id of the clothingDesign to retrieve.
   * @returns {Promise<ClothingDesignModel>} - The clothingDesign object.
   * @throws {NotFoundException} - If the clothingDesign with the given id is not found.
   */
  async getClothingDesignById(userId: string,id: string): Promise<ClothingDesignModel> {
    try {
      const clothingDesign = 
      await this.clothingDesignModel
      .findOne({ _id: new Types.ObjectId(id), user: new Types.ObjectId(userId), })
      .populate(
        [
        ]
      )
      .exec();
      if (!clothingDesign) {
        throw new NotFoundException('ClothingDesignModel not found');
      }
      return clothingDesign;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new clothingDesign for a specific user.
   *
   * @param {string} userId - The ID of the user whose clothingDesigns to retrieve.
   * @param {CreateClothingDesignDto} createClothingDesignDto - The DTO for creating a clothingDesign.
   * @returns {Promise<ClothingDesignModel>} - The newly created clothingDesign object.
   */
  async createClothingDesign(userId: string,createClothingDesignDto: CreateClothingDesignDto): Promise<ClothingDesignModel> {
    try {
      const clothingDesign = new this.clothingDesignModel({
        designName: createClothingDesignDto.designName,
                description: createClothingDesignDto.description,
                imageUrl: createClothingDesignDto.imageUrl,
                price: createClothingDesignDto.price,
                isVirtual: createClothingDesignDto.isVirtual,
                isCustomizable: createClothingDesignDto.isCustomizable,
                gender: createClothingDesignDto.gender,
                user: new Types.ObjectId(userId), 
      });
      return clothingDesign.save();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing clothingDesign for a specific user.
   *
   * @param {string} userId - The ID of the user whose clothingDesigns to retrieve.
   * @param {string} id - The id of the clothingDesign to update.
   * @param {UpdateClothingDesignDto} updateClothingDesignDto - The DTO for updating a clothingDesign.
   * @returns {Promise<ClothingDesignModel>} - The updated clothingDesign object.
   * @throws {NotFoundException} - If the clothingDesign with the given id is not found.
   */
  async updateClothingDesign(userId: string,id: string, updateClothingDesignDto: UpdateClothingDesignDto): Promise<ClothingDesignModel> {
    try {

      //TODO: Fix update
      const clothingDesign = await this.getClothingDesignById(userId, id);

      if (!clothingDesign) {
        throw new NotFoundException(`${this.clothingDesignModel.modelName} not found`);
      }

      // Apply partial updates
      const update: UpdateQuery<ClothingDesignModel> = {};
      for (const field in updateClothingDesignDto) {
        if (updateClothingDesignDto.hasOwnProperty(field)) {
          update[field] = updateClothingDesignDto[field];
        }
      }

      // Save the updated document
      clothingDesign.set(update);
      return clothingDesign.save();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a clothingDesign for a specific user by its ID.
   *
   * @param {string} userId - The ID of the user whose clothingDesigns to retrieve.
   * @param {string} id - The id of the clothingDesign to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the clothingDesign with the given ID is not found.
   */
  async deleteClothingDesign(userId: string,id: string): Promise<void> {
    try {
      const clothingDesign = await this.getClothingDesignById(userId,id);
      await clothingDesign.deleteOne();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find clothingDesign data for dropdowns with optional filtering.
   *
   * @param {string} userId - The ID of the user whose clothingDesigns to retrieve.
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - The keyword for filtering data.
   * @returns {Promise<ClothingDesignEntity[]>} - The list of clothingDesign data for dropdowns.
   */
  async findAllDropdownData(userId: string,fields: string[], keyword: string): Promise<ClothingDesignModel[]> {
    try {
      const select = fields.reduce((obj, field) => {
        obj[field] = 1;
        return obj;
      }, {});

      const whereConditions = fields.map((field) => ({
        [field]: { $regex: new RegExp(keyword, 'i') }, // Case-insensitive search
      }));

      return await this.clothingDesignModel
        .find({ user: new Types.ObjectId(userId), $or: whereConditions })
        .select(select)
        .limit(25)
        .exec();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

}
