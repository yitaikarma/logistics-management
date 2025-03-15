 /*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 商品控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { CommodityService } from '../services/commodity.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody } from '../middlewares/validate.middleware'
import { CreateCommoditySchema, UpdateCommoditySchema } from '../validate/commodity.validate'

@Controller({ path: '/api/commodities' })
@UseMiddleware(authMiddleware)
export class CommodityController {
    private commodityService: CommodityService

    constructor() {
        this.commodityService = new CommodityService()
    }

    @Get('/page')
    async getPageAllCommodities(@Query('currentPage') currentPage?: string, @Query('pageSize') pageSize?: string, @Query('name') name?: string) {
        const newCurrentPage = currentPage ? parseInt(currentPage, 10) : 1
        const newPageSize = pageSize ? parseInt(pageSize, 10) : 10
        return await this.commodityService.findPageAll(newCurrentPage, newPageSize,name)
    }

    @Get()
    async getAllCommodities(@Query('name') name?: string) {
      
        return await this.commodityService.findAll(name )
    }

    @Get('/:id')
    async getCommodityById(@Param('id') id: string) {
        const commodityId = parseInt(id, 10)
        return await this.commodityService.findById(commodityId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateCommoditySchema))
    async createCommodity(@Body() commodityData: any) {
        return await this.commodityService.create(commodityData)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateCommoditySchema))
    async updateCommodity(@Param('id') id: string, @Body() commodityData: any) {
        const commodityId = parseInt(id, 10)
        return await this.commodityService.update(commodityId, commodityData)
    }

    @Delete('/:id')
    async deleteCommodity(@Param('id') id: string) {
        const commodityId = parseInt(id, 10)
        return await this.commodityService.delete(commodityId)
    }
}
