/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 仓库分类控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { WarehouseCategoryService } from '../services/warehouseCategory.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { CreateWarehouseCategorySchema, UpdateWarehouseCategorySchema, WarehouseCategoryQuerySchema } from '../validate/warehouseCategory.validate'

@Controller({ path: '/api/warehouseCategories' })
@UseMiddleware(authMiddleware)
export class WarehouseCategoryController {
    private warehouseCategoryService: WarehouseCategoryService

    constructor() {
        this.warehouseCategoryService = new WarehouseCategoryService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(WarehouseCategoryQuerySchema))
    async getPageAllWarehouseCategories(@Query() query?: WarehouseCategoryQuerySchema) {
        return await this.warehouseCategoryService.findPageAll(query)
    }

    @Get()
    @UseMiddleware(validateQuery(WarehouseCategoryQuerySchema))
    async getAllWarehouseCategories(@Query() query?: WarehouseCategoryQuerySchema) {
        return await this.warehouseCategoryService.findAll(query)
    }

    @Get('/:id')
    async getWarehouseCategoryById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.warehouseCategoryService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateWarehouseCategorySchema))
    async createWarehouseCategory(@Body() body: any) {
        return await this.warehouseCategoryService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateWarehouseCategorySchema))
    async updateWarehouseCategory(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.warehouseCategoryService.update(intId, body)
    }

    @Delete('/:id')
    async deleteWarehouseCategory(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.warehouseCategoryService.delete(intId)
    }
}
