import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types, UpdateQuery } from 'mongoose';
import { convertArrayToObject, getPipelineStageForPagination } from 'src/shared/utils/common'
import { UserPreferenceModel } from './user-preference.model';
import { CreateUserPreferenceDto } from './create-user-preference.dto';
import { UpdateUserPreferenceDto } from './update-user-preference.dto';

@Injectable()
export class UserPreferenceService {
  constructor(
    @InjectModel(UserPreferenceModel.name)
    private readonly userPreferenceModel: Model<UserPreferenceModel>,
  ) {}

  /**
   * Retrieve a paginated list of userPreferences for a specific user.
   *
   * @param {string} userId - The ID of the user whose userPreferences to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: UserPreferenceModel[]; total: number }>} - The list of userPreferences and the total count.
   */
  async getAllUserPreferences(
    userId: string,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: UserPreferenceModel[]; total: number }> {
    try {
      const pipeline: PipelineStage[] = [
        {
          $match: {
            user: new Types.ObjectId(userId),
          },
        },
        {
          $project: {
            preferredColor: 1,
                        preferredStyle: 1,
                        preferredMaterial: 1,
                      },
        },
      ];

      if (searchTerm) {
        // Add a $match stage to filter results based on searchTerm
        pipeline.push({
          $match: {
            $or: [
              { preferredColor: { $regex: searchTerm, $options: 'i' } },
                            { preferredStyle: { $regex: searchTerm, $options: 'i' } },
                            { preferredMaterial: { $regex: searchTerm, $options: 'i' } },
                            // Add more fields as needed
            ],
          },
        });
      }

      pipeline.push(...getPipelineStageForPagination(skip, take))

      const [result] = await this.userPreferenceModel.aggregate(pipeline);

      // Extract the total count and matched documents from the aggregation result
      const total = result ? result.total : 0;
      const matchedComments = result ? result.result : [];

      return { result: matchedComments, total };

    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a userPreference by ID for a specific user.
   *
   * @param {string} userId - The ID of the user whose userPreferences to retrieve.
   * @param {string} id - The id of the userPreference to retrieve.
   * @returns {Promise<UserPreferenceModel>} - The userPreference object.
   * @throws {NotFoundException} - If the userPreference with the given id is not found.
   */
  async getUserPreferenceById(userId: string,id: string): Promise<UserPreferenceModel> {
    try {
      const userPreference = 
      await this.userPreferenceModel
      .findOne({ _id: new Types.ObjectId(id), user: new Types.ObjectId(userId), })
      .populate(
        [
        ]
      )
      .exec();
      if (!userPreference) {
        throw new NotFoundException('UserPreferenceModel not found');
      }
      return userPreference;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new userPreference for a specific user.
   *
   * @param {string} userId - The ID of the user whose userPreferences to retrieve.
   * @param {CreateUserPreferenceDto} createUserPreferenceDto - The DTO for creating a userPreference.
   * @returns {Promise<UserPreferenceModel>} - The newly created userPreference object.
   */
  async createUserPreference(userId: string,createUserPreferenceDto: CreateUserPreferenceDto): Promise<UserPreferenceModel> {
    try {
      const userPreference = new this.userPreferenceModel({
        preferredColors: createUserPreferenceDto.preferredColors,
                preferredStyles: createUserPreferenceDto.preferredStyles,
                preferredMaterials: createUserPreferenceDto.preferredMaterials,
                user: new Types.ObjectId(userId), 
      });
      return userPreference.save();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing userPreference for a specific user.
   *
   * @param {string} userId - The ID of the user whose userPreferences to retrieve.
   * @param {string} id - The id of the userPreference to update.
   * @param {UpdateUserPreferenceDto} updateUserPreferenceDto - The DTO for updating a userPreference.
   * @returns {Promise<UserPreferenceModel>} - The updated userPreference object.
   * @throws {NotFoundException} - If the userPreference with the given id is not found.
   */
  async updateUserPreference(userId: string,id: string, updateUserPreferenceDto: UpdateUserPreferenceDto): Promise<UserPreferenceModel> {
    try {

      //TODO: Fix update
      const userPreference = await this.getUserPreferenceById(userId, id);

      if (!userPreference) {
        throw new NotFoundException(`${this.userPreferenceModel.modelName} not found`);
      }

      // Apply partial updates
      const update: UpdateQuery<UserPreferenceModel> = {};
      for (const field in updateUserPreferenceDto) {
        if (updateUserPreferenceDto.hasOwnProperty(field)) {
          update[field] = updateUserPreferenceDto[field];
        }
      }

      // Save the updated document
      userPreference.set(update);
      return userPreference.save();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a userPreference for a specific user by its ID.
   *
   * @param {string} userId - The ID of the user whose userPreferences to retrieve.
   * @param {string} id - The id of the userPreference to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the userPreference with the given ID is not found.
   */
  async deleteUserPreference(userId: string,id: string): Promise<void> {
    try {
      const userPreference = await this.getUserPreferenceById(userId,id);
      await userPreference.deleteOne();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find userPreference data for dropdowns with optional filtering.
   *
   * @param {string} userId - The ID of the user whose userPreferences to retrieve.
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - The keyword for filtering data.
   * @returns {Promise<UserPreferenceEntity[]>} - The list of userPreference data for dropdowns.
   */
  async findAllDropdownData(userId: string,fields: string[], keyword: string): Promise<UserPreferenceModel[]> {
    try {
      const select = fields.reduce((obj, field) => {
        obj[field] = 1;
        return obj;
      }, {});

      const whereConditions = fields.map((field) => ({
        [field]: { $regex: new RegExp(keyword, 'i') }, // Case-insensitive search
      }));

      return await this.userPreferenceModel
        .find({ user: new Types.ObjectId(userId), $or: whereConditions })
        .select(select)
        .limit(25)
        .exec();
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

}
