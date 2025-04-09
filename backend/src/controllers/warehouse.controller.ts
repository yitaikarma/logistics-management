/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 仓库控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { WarehouseService } from '../services/warehouse.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { CreateWarehouseSchema, UpdateWarehouseSchema, WarehouseQuerySchema } from '../validate/warehouse.validate'

@Controller({ path: '/api/warehouses' })
@UseMiddleware(authMiddleware)
export class WarehouseController {
    private warehouseService: WarehouseService

    constructor() {
        this.warehouseService = new WarehouseService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(WarehouseQuerySchema))
    async getPageAllWarehouses(@Query() query?: WarehouseQuerySchema) {
        return await this.warehouseService.findPageAll(query)
    }

    @Get()
    @UseMiddleware(validateQuery(WarehouseQuerySchema))
    async getAllWarehouses(@Query() query?: WarehouseQuerySchema) {
        return await this.warehouseService.findAll(query)
    }

    @Get('/:id')
    async getWarehouseById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.warehouseService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateWarehouseSchema))
    async createWarehouse(@Body() body: any) {
        return await this.warehouseService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateWarehouseSchema))
    async updateWarehouse(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.warehouseService.update(intId, body)
    }

    @Delete('/:id')
    async deleteWarehouse(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.warehouseService.delete(intId)
    }
}
