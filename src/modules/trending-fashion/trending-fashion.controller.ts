import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { TrendingFashionService } from './trending-fashion.service';
import { TrendingFashionModel } from './trending-fashion.model';
import { CreateTrendingFashionDto } from './create-trending-fashion.dto';
import { UpdateTrendingFashionDto } from './update-trending-fashion.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('TrendingFashions')
@Controller('trendingFashions')
export class TrendingFashionController {
  constructor(
    private trendingFashionService: TrendingFashionService,
  ) {}


  /**
   * Get all trendingFashions with pagination support.
   *
   * 
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering trendingFashions.
   * @returns {Promise<{ result: TrendingFashionModel[]; total: number }>} - The list of trendingFashions and the total count.
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
  async getAllTrendingFashions(
    
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: TrendingFashionModel[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.trendingFashionService.getAllTrendingFashions(
      
      skip,
      itemsPerPage,
      search
    );
  }

  /**
   * Get trendingFashion data for dropdowns.
   *
   * 
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<TrendingFashionModel[]>} - The list of trendingFashion data for dropdowns.
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
  async getTrendingFashionDropdownData(
    
    @Query('fields') fields: string,
    @Query('keyword') keyword: string,
  ): Promise<TrendingFashionModel[]> {
    const fieldArray = fields ? fields.split(',') : [
      'id',
    ]
    return this.trendingFashionService.findAllDropdownData(
      
      fieldArray, 
      keyword
    );
  }

  /**
   * Get a trendingFashion by ID.
   *
   * 
   * @param {string} id - The id of the trendingFashion to retrieve.
   * @returns {Promise<TrendingFashionModel>} - The trendingFashion object.
   */
  @Get(':id')
  async getTrendingFashionById(
    
    @Param('id') id: string
  ): Promise<TrendingFashionModel> {
    return this.trendingFashionService.getTrendingFashionById(
      
      id
    );
  }

  /**
   * Create a new trendingFashion.
   *
   * 
   * @param {CreateTrendingFashionDto} createTrendingFashionDto - The DTO for creating a trendingFashion.
   * @returns {Promise<TrendingFashionModel>} - The newly created trendingFashion object.
   */
  @Post()
  async createTrendingFashion(
    
    @Body() createTrendingFashionDto: CreateTrendingFashionDto
  ): Promise<TrendingFashionModel> {
    return this.trendingFashionService.createTrendingFashion(
      
      createTrendingFashionDto
    );
  }

  /**
   * Update an existing trendingFashion.
   *
   * 
   * @param {string} id - The id of the trendingFashion to update.
   * @param {UpdateTrendingFashionDto} updateTrendingFashionDto - The DTO for updating a trendingFashion.
   * @returns {Promise<TrendingFashionModel>} - The updated trendingFashion object.
   */
  @Put(':id')
  async updateTrendingFashion(
    
    @Param('id') id: string,
    @Body() updateTrendingFashionDto: UpdateTrendingFashionDto,
  ): Promise<TrendingFashionModel> {
    return this.trendingFashionService.updateTrendingFashion(
      
      id, 
      updateTrendingFashionDto
    );
  }


  /**
   * Delete a trendingFashion by ID.
   *
   * 
   * @param {string} id - The id of the trendingFashion to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteTrendingFashion(
    
    @Param('id') id: string
  ): Promise<void> {
    return this.trendingFashionService.deleteTrendingFashion(
      
      id
    );
  }
}
