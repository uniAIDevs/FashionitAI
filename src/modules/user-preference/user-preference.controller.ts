import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { UserPreferenceService } from './user-preference.service';
import { UserPreferenceModel } from './user-preference.model';
import { CreateUserPreferenceDto } from './create-user-preference.dto';
import { UpdateUserPreferenceDto } from './update-user-preference.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('UserPreferences')
@Controller('userPreferences')
export class UserPreferenceController {
  constructor(
    private userPreferenceService: UserPreferenceService,
  ) {}


  /**
   * Get all userPreferences with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering userPreferences.
   * @returns {Promise<{ result: UserPreferenceModel[]; total: number }>} - The list of userPreferences and the total count.
   */
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Optional page for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Optional limit for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Optional search for searching',
  })
  async getAllUserPreferences(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: UserPreferenceModel[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.userPreferenceService.getAllUserPreferences(
      req.user.userId,
      skip,
      itemsPerPage,
      search
    );
  }

  /**
   * Get userPreference data for dropdowns.
   *
   * @param {Request} req - The Express request object.
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<UserPreferenceModel[]>} - The list of userPreference data for dropdowns.
   */
  @Get('dropdown')
  @ApiQuery({
    name: 'fields',
    required: false,
    type: String,
    description: 'Optional fields for filtering',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Optional keyword for filtering',
  })
  async getUserPreferenceDropdownData(
    @Req() req,
    @Query('fields') fields: string,
    @Query('keyword') keyword: string,
  ): Promise<UserPreferenceModel[]> {
    const fieldArray = fields ? fields.split(',') : [
      'id',
    ]
    return this.userPreferenceService.findAllDropdownData(
      req.user.userId,
      fieldArray, 
      keyword
    );
  }

  /**
   * Get a userPreference by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {string} id - The id of the userPreference to retrieve.
   * @returns {Promise<UserPreferenceModel>} - The userPreference object.
   */
  @Get(':id')
  async getUserPreferenceById(
    @Req() req,
    @Param('id') id: string
  ): Promise<UserPreferenceModel> {
    return this.userPreferenceService.getUserPreferenceById(
      req.user.userId,
      id
    );
  }

  /**
   * Create a new userPreference.
   *
   * @param {Request} req - The Express request object.
   * @param {CreateUserPreferenceDto} createUserPreferenceDto - The DTO for creating a userPreference.
   * @returns {Promise<UserPreferenceModel>} - The newly created userPreference object.
   */
  @Post()
  async createUserPreference(
    @Req() req,
    @Body() createUserPreferenceDto: CreateUserPreferenceDto
  ): Promise<UserPreferenceModel> {
    return this.userPreferenceService.createUserPreference(
      req.user.userId,
      createUserPreferenceDto
    );
  }

  /**
   * Update an existing userPreference.
   *
   * @param {Request} req - The Express request object.
   * @param {string} id - The id of the userPreference to update.
   * @param {UpdateUserPreferenceDto} updateUserPreferenceDto - The DTO for updating a userPreference.
   * @returns {Promise<UserPreferenceModel>} - The updated userPreference object.
   */
  @Put(':id')
  async updateUserPreference(
    @Req() req,
    @Param('id') id: string,
    @Body() updateUserPreferenceDto: UpdateUserPreferenceDto,
  ): Promise<UserPreferenceModel> {
    return this.userPreferenceService.updateUserPreference(
      req.user.userId,
      id, 
      updateUserPreferenceDto
    );
  }


  /**
   * Delete a userPreference by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {string} id - The id of the userPreference to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteUserPreference(
    @Req() req,
    @Param('id') id: string
  ): Promise<void> {
    return this.userPreferenceService.deleteUserPreference(
      req.user.userId,
      id
    );
  }
}
