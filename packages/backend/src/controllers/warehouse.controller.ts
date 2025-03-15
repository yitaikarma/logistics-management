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
import { validateBody } from '../middlewares/validate.middleware'
import { CreateWarehouseSchema, UpdateWarehouseSchema } from '../validate/warehouse.validate'

@Controller({ path: '/api/warehouses' })
@UseMiddleware(authMiddleware)
export class WarehouseController {
    private warehouseService: WarehouseService

    constructor() {
        this.warehouseService = new WarehouseService()
    }

    @Get('/page')
    async getPageAllWarehouses(@Query('currentPage') currentPage?: string, @Query('pageSize') pageSize?: string, @Query('name') name?: string) {
        const newCurrentPage = currentPage ? parseInt(currentPage, 10) : 1
        const newPageSize = pageSize ? parseInt(pageSize, 10) : 10
        return await this.warehouseService.findPageAll(newCurrentPage, newPageSize, name)
    }

    @Get()
    async getAllWarehouses(@Query('name') name?: string) {
        return await this.warehouseService.findAll(name)
    }

    @Get('/:id')
    async getWarehouseById(@Param('id') id: string) {
        const warehouseId = parseInt(id, 10)
        return await this.warehouseService.findById(warehouseId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateWarehouseSchema))
    async createWarehouse(@Body() warehouseData: any) {
        return await this.warehouseService.create(warehouseData)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateWarehouseSchema))
    async updateWarehouse(@Param('id') id: string, @Body() warehouseData: any) {
        const warehouseId = parseInt(id, 10)
        return await this.warehouseService.update(warehouseId, warehouseData)
    }

    @Delete('/:id')
    async deleteWarehouse(@Param('id') id: string) {
        const warehouseId = parseInt(id, 10)
        return await this.warehouseService.delete(warehouseId)
    }
}
