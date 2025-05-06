/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 配送控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { DistributionService } from '../services/distribution.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { DistributionQuerySchema, CreateDistributionSchema, UpdateDistributionSchema } from '../validate/distribution.validate'

@Controller({ path: '/api/distributions' })
@UseMiddleware(authMiddleware)
export class DistributionController {
    private distributionService: DistributionService

    constructor() {
        this.distributionService = new DistributionService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(DistributionQuerySchema))
    async getPageAllDistributions(@Query() query?: DistributionQuerySchema) {
        return await this.distributionService.findPageAll(query)
    }

    @Get('/page/completed')
    @UseMiddleware(validateQuery(DistributionQuerySchema))
    async getPageAllDistributionsCompleted(@Query() query?: DistributionQuerySchema) {
        return await this.distributionService.findPageAll(query, 'completed')
    }

    @Get()
    @UseMiddleware(validateQuery(DistributionQuerySchema))
    async getAllDistributions(@Query() query?: DistributionQuerySchema) {
        return await this.distributionService.findAll(query)
    }

    @Get('/:id')
    async getDistributionById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.distributionService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateDistributionSchema))
    async createDistribution(@Body() body: any) {
        return await this.distributionService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateDistributionSchema))
    async updateDistribution(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.distributionService.update(intId, body)
    }

    @Delete('/:id')
    async deleteDistribution(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.distributionService.delete(intId)
    }
}
