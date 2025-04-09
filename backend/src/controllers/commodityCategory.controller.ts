/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 商品分类控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { CommodityCategoryService } from '../services/commodityCategory.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { CommodityCategoryQuerySchema, CreateCommodityCategorySchema, UpdateCommodityCategorySchema } from '../validate/commodityCategory.validate'

@Controller({ path: '/api/commodityCategories' })
@UseMiddleware(authMiddleware)
export class CommodityCategoryController {
    private commodityCategoryService: CommodityCategoryService

    constructor() {
        this.commodityCategoryService = new CommodityCategoryService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(CommodityCategoryQuerySchema))
    async getPageAllCommodityCategories(@Query() query?: CommodityCategoryQuerySchema) {
        return await this.commodityCategoryService.findPageAll(query)
    }

    @Get()
    @UseMiddleware(validateQuery(CommodityCategoryQuerySchema))
    async getAllCommodityCategories(@Query() query?: CommodityCategoryQuerySchema) {
        return await this.commodityCategoryService.findAll(query)
    }

    @Get('/:id')
    async getCommodityCategoryById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.commodityCategoryService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateCommodityCategorySchema))
    async createCommodityCategory(@Body() body: any) {
        return await this.commodityCategoryService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateCommodityCategorySchema))
    async updateCommodityCategory(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.commodityCategoryService.update(intId, body)
    }

    @Delete('/:id')
    async deleteCommodityCategory(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.commodityCategoryService.delete(intId)
    }
}
