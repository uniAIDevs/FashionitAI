import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ClothingDesignService } from './clothing-design.service';
import { TrendingFashionService } from 'src/modules/trending-fashion/trending-fashion.service';
import { ClothingDesignModel } from './clothing-design.model';
import { TrendingFashionModel } from 'src/modules/trending-fashion/trending-fashion.model';
import { CreateClothingDesignDto } from './create-clothing-design.dto';
import { UpdateClothingDesignDto } from './update-clothing-design.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('ClothingDesigns')
@Controller('clothingDesigns')
export class ClothingDesignController {
  constructor(
    private clothingDesignService: ClothingDesignService,
    private trendingFashionService: TrendingFashionService,
  ) {}

  /**
   * Get all trendingFashions by clothingDesigns with pagination support.
   *
   * 
   * @param {string} designId - The designId of the trendingFashion to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering trendingFashions.
   * @returns {Promise<{ result: TrendingFashionModel[]; total: number }>} - The list of trendingFashions and the total count.
   */
  @Get(':designId/trendingFashion')
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
  async getTrendingFashionsByDesignId(
    
    @Param('designId') designId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: TrendingFashionModel[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.trendingFashionService.getTrendingFashionsByDesignId(
      
      designId,
      skip,
      itemsPerPage,
      search
    );
  }
  

  /**
   * Get all clothingDesigns with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering clothingDesigns.
   * @returns {Promise<{ result: ClothingDesignModel[]; total: number }>} - The list of clothingDesigns and the total count.
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
  async getAllClothingDesigns(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: ClothingDesignModel[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.clothingDesignService.getAllClothingDesigns(
      req.user.userId,
      skip,
      itemsPerPage,
      search
    );
  }

  /**
   * Get clothingDesign data for dropdowns.
   *
   * @param {Request} req - The Express request object.
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<ClothingDesignModel[]>} - The list of clothingDesign data for dropdowns.
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
  async getClothingDesignDropdownData(
    @Req() req,
    @Query('fields') fields: string,
    @Query('keyword') keyword: string,
  ): Promise<ClothingDesignModel[]> {
    const fieldArray = fields ? fields.split(',') : [
      'id',
      'designName',
    ]
    return this.clothingDesignService.findAllDropdownData(
      req.user.userId,
      fieldArray, 
      keyword
    );
  }

  /**
   * Get a clothingDesign by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {string} id - The id of the clothingDesign to retrieve.
   * @returns {Promise<ClothingDesignModel>} - The clothingDesign object.
   */
  @Get(':id')
  async getClothingDesignById(
    @Req() req,
    @Param('id') id: string
  ): Promise<ClothingDesignModel> {
    return this.clothingDesignService.getClothingDesignById(
      req.user.userId,
      id
    );
  }

  /**
   * Create a new clothingDesign.
   *
   * @param {Request} req - The Express request object.
   * @param {CreateClothingDesignDto} createClothingDesignDto - The DTO for creating a clothingDesign.
   * @returns {Promise<ClothingDesignModel>} - The newly created clothingDesign object.
   */
  @Post()
  async createClothingDesign(
    @Req() req,
    @Body() createClothingDesignDto: CreateClothingDesignDto
  ): Promise<ClothingDesignModel> {
    return this.clothingDesignService.createClothingDesign(
      req.user.userId,
      createClothingDesignDto
    );
  }

  /**
   * Update an existing clothingDesign.
   *
   * @param {Request} req - The Express request object.
   * @param {string} id - The id of the clothingDesign to update.
   * @param {UpdateClothingDesignDto} updateClothingDesignDto - The DTO for updating a clothingDesign.
   * @returns {Promise<ClothingDesignModel>} - The updated clothingDesign object.
   */
  @Put(':id')
  async updateClothingDesign(
    @Req() req,
    @Param('id') id: string,
    @Body() updateClothingDesignDto: UpdateClothingDesignDto,
  ): Promise<ClothingDesignModel> {
    return this.clothingDesignService.updateClothingDesign(
      req.user.userId,
      id, 
      updateClothingDesignDto
    );
  }


  /**
   * Delete a clothingDesign by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {string} id - The id of the clothingDesign to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteClothingDesign(
    @Req() req,
    @Param('id') id: string
  ): Promise<void> {
    return this.clothingDesignService.deleteClothingDesign(
      req.user.userId,
      id
    );
  }
}
