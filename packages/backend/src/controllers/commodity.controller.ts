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
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { CommodityQuerySchema, CreateCommoditySchema, UpdateCommoditySchema } from '../validate/commodity.validate'

@Controller({ path: '/api/commodities' })
@UseMiddleware(authMiddleware)
export class CommodityController {
    private commodityService: CommodityService

    constructor() {
        this.commodityService = new CommodityService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(CommodityQuerySchema))
    async getPageAllCommodities(@Query() query?: CommodityQuerySchema) {
        return await this.commodityService.findPageAll(query)
    }

    @Get()
    @UseMiddleware(validateQuery(CommodityQuerySchema))
    async getAllCommodities(@Query() query?: CommodityQuerySchema) {
        return await this.commodityService.findAll(query)
    }

    @Get('/:id')
    async getCommodityById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.commodityService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateCommoditySchema))
    async createCommodity(@Body() body: any) {
        return await this.commodityService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateCommoditySchema))
    async updateCommodity(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.commodityService.update(intId, body)
    }

    @Delete('/:id')
    async deleteCommodity(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.commodityService.delete(intId)
    }
}
