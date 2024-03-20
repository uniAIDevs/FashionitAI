import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { BodyMeasurementService } from './body-measurement.service';
import { BodyMeasurementModel } from './body-measurement.model';
import { CreateBodyMeasurementDto } from './create-body-measurement.dto';
import { UpdateBodyMeasurementDto } from './update-body-measurement.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('BodyMeasurements')
@Controller('bodyMeasurements')
export class BodyMeasurementController {
  constructor(
    private bodyMeasurementService: BodyMeasurementService,
  ) {}


  /**
   * Get all bodyMeasurements with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering bodyMeasurements.
   * @returns {Promise<{ result: BodyMeasurementModel[]; total: number }>} - The list of bodyMeasurements and the total count.
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
  async getAllBodyMeasurements(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: BodyMeasurementModel[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.bodyMeasurementService.getAllBodyMeasurements(
      req.user.userId,
      skip,
      itemsPerPage,
      search
    );
  }

  /**
   * Get bodyMeasurement data for dropdowns.
   *
   * @param {Request} req - The Express request object.
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<BodyMeasurementModel[]>} - The list of bodyMeasurement data for dropdowns.
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
  async getBodyMeasurementDropdownData(
    @Req() req,
    @Query('fields') fields: string,
    @Query('keyword') keyword: string,
  ): Promise<BodyMeasurementModel[]> {
    const fieldArray = fields ? fields.split(',') : [
      'id',
    ]
    return this.bodyMeasurementService.findAllDropdownData(
      req.user.userId,
      fieldArray, 
      keyword
    );
  }

  /**
   * Get a bodyMeasurement by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {string} id - The id of the bodyMeasurement to retrieve.
   * @returns {Promise<BodyMeasurementModel>} - The bodyMeasurement object.
   */
  @Get(':id')
  async getBodyMeasurementById(
    @Req() req,
    @Param('id') id: string
  ): Promise<BodyMeasurementModel> {
    return this.bodyMeasurementService.getBodyMeasurementById(
      req.user.userId,
      id
    );
  }

  /**
   * Create a new bodyMeasurement.
   *
   * @param {Request} req - The Express request object.
   * @param {CreateBodyMeasurementDto} createBodyMeasurementDto - The DTO for creating a bodyMeasurement.
   * @returns {Promise<BodyMeasurementModel>} - The newly created bodyMeasurement object.
   */
  @Post()
  async createBodyMeasurement(
    @Req() req,
    @Body() createBodyMeasurementDto: CreateBodyMeasurementDto
  ): Promise<BodyMeasurementModel> {
    return this.bodyMeasurementService.createBodyMeasurement(
      req.user.userId,
      createBodyMeasurementDto
    );
  }

  /**
   * Update an existing bodyMeasurement.
   *
   * @param {Request} req - The Express request object.
   * @param {string} id - The id of the bodyMeasurement to update.
   * @param {UpdateBodyMeasurementDto} updateBodyMeasurementDto - The DTO for updating a bodyMeasurement.
   * @returns {Promise<BodyMeasurementModel>} - The updated bodyMeasurement object.
   */
  @Put(':id')
  async updateBodyMeasurement(
    @Req() req,
    @Param('id') id: string,
    @Body() updateBodyMeasurementDto: UpdateBodyMeasurementDto,
  ): Promise<BodyMeasurementModel> {
    return this.bodyMeasurementService.updateBodyMeasurement(
      req.user.userId,
      id, 
      updateBodyMeasurementDto
    );
  }


  /**
   * Delete a bodyMeasurement by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {string} id - The id of the bodyMeasurement to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteBodyMeasurement(
    @Req() req,
    @Param('id') id: string
  ): Promise<void> {
    return this.bodyMeasurementService.deleteBodyMeasurement(
      req.user.userId,
      id
    );
  }
}
