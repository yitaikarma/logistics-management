/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 库存控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { InventoryService } from '../services/inventory.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { InventoryQuerySchema, CreateInventorySchema, UpdateInventorySchema } from '../validate/inventory.validate'

@Controller({ path: '/api/inventories' })
@UseMiddleware(authMiddleware)
export class InventoryController {
    private inventoryService: InventoryService

    constructor() {
        this.inventoryService = new InventoryService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(InventoryQuerySchema))
    async getPageAllInventories(@Query() query?: InventoryQuerySchema) {
        return await this.inventoryService.findPageAll(query)
    }

    @Get()
    @UseMiddleware(validateQuery(InventoryQuerySchema))
    async getAllInventories(@Query() query?: InventoryQuerySchema) {
        return await this.inventoryService.findAll(query)
    }

    @Get('/:id')
    async getInventoryById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.inventoryService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateInventorySchema))
    async createInventory(@Body() body: any) {
        return await this.inventoryService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateInventorySchema))
    async updateInventory(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.inventoryService.update(intId, body)
    }

    @Delete('/:id')
    async deleteInventory(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.inventoryService.delete(intId)
    }
}
