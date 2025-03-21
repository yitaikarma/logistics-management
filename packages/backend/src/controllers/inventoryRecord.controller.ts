/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 库存记录控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { InventoryRecordService } from '../services/inventoryRecord.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { InventoryRecordQuerySchema, CreateInventoryRecordSchema, UpdateInventoryRecordSchema } from '../validate/inventoryRecord.validate'

@Controller({ path: '/api/inventoryRecords' })
@UseMiddleware(authMiddleware)
export class InventoryRecordController {
    private inventoryRecordService: InventoryRecordService

    constructor() {
        this.inventoryRecordService = new InventoryRecordService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(InventoryRecordQuerySchema))
    async getPageAllInventoryRecords(@Query() query?: InventoryRecordQuerySchema) {
        return await this.inventoryRecordService.findPageAll(query)
    }

    @Get()
    @UseMiddleware(validateQuery(InventoryRecordQuerySchema))
    async getAllInventoryRecords(@Query() query?: InventoryRecordQuerySchema) {
        return await this.inventoryRecordService.findAll(query)
    }

    @Get('/:id')
    async getInventoryRecordById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.inventoryRecordService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateInventoryRecordSchema))
    async createInventoryRecord(@Body() body: any) {
        return await this.inventoryRecordService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateInventoryRecordSchema))
    async updateInventoryRecord(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.inventoryRecordService.update(intId, body)
    }

    @Delete('/:id')
    async deleteInventoryRecord(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.inventoryRecordService.delete(intId)
    }
}
