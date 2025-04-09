/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 配送分类控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { DistributionCategoryService } from '../services/distributionCategory.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { DistributionCategoryQuerySchema, CreateDistributionCategorySchema, UpdateDistributionCategorySchema } from '../validate/distributionCategory.validate'

@Controller({ path: '/api/distributionCategories' })
@UseMiddleware(authMiddleware)
export class DistributionCategoryController {
    private distributionCategoryService: DistributionCategoryService

    constructor() {
        this.distributionCategoryService = new DistributionCategoryService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(DistributionCategoryQuerySchema))
    async getPageAllDistributionCategories(@Query() query?: DistributionCategoryQuerySchema) {
        return await this.distributionCategoryService.findPageAll(query)
    }

    @Get()
    @UseMiddleware(validateQuery(DistributionCategoryQuerySchema))
    async getAllDistributionCategories(@Query() query?: DistributionCategoryQuerySchema) {
        return await this.distributionCategoryService.findAll(query)
    }

    @Get('/:id')
    async getDistributionCategoryById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.distributionCategoryService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateDistributionCategorySchema))
    async createDistributionCategory(@Body() body: any) {
        return await this.distributionCategoryService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateDistributionCategorySchema))
    async updateDistributionCategory(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.distributionCategoryService.update(intId, body)
    }

    @Delete('/:id')
    async deleteDistributionCategory(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.distributionCategoryService.delete(intId)
    }
}
