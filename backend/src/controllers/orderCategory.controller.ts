/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 订单分类控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { OrderCategoryService } from '../services/orderCategory.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { CreateOrderCategorySchema, OrderCategoryQuerySchema, UpdateOrderCategorySchema } from '../validate/orderCategory.validate'

@Controller({ path: '/api/orderCategories' })
@UseMiddleware(authMiddleware)
export class OrderCategoryController {
    private orderCategoryService: OrderCategoryService

    constructor() {
        this.orderCategoryService = new OrderCategoryService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(OrderCategoryQuerySchema))
    async getPageAllOrderCategories(@Query() query?: OrderCategoryQuerySchema) {
        return await this.orderCategoryService.findPageAll(query)
    }

    @Get()
    @UseMiddleware(validateQuery(OrderCategoryQuerySchema))
    async getAllOrderCategories(@Query() query?: OrderCategoryQuerySchema) {
        return await this.orderCategoryService.findAll(query)
    }

    @Get('/:id')
    async getOrderCategoryById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.orderCategoryService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateOrderCategorySchema))
    async createOrderCategory(@Body() body: any) {
        return await this.orderCategoryService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateOrderCategorySchema))
    async updateOrderCategory(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.orderCategoryService.update(intId, body)
    }

    @Delete('/:id')
    async deleteOrderCategory(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.orderCategoryService.delete(intId)
    }
}
