/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 订单控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { OrderService } from '../services/order.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { CreateOrderSchema, OrderQuerySchema, UpdateOrderSchema } from '../validate/order.validate'

@Controller({ path: '/api/orders' })
@UseMiddleware(authMiddleware)
export class OrderController {
    private orderService: OrderService

    constructor() {
        this.orderService = new OrderService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(OrderQuerySchema))
    async getPageAllOrders(@Query() query?: OrderQuerySchema) {
        return await this.orderService.findPageAll(query)
    }

    @Get()
    @UseMiddleware(validateQuery(OrderQuerySchema))
    async getAllOrders(@Query() query?: OrderQuerySchema) {
        return await this.orderService.findAll(query)
    }

    @Get('/:id')
    async getOrderById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.orderService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateOrderSchema))
    async createOrder(@Body() body: any) {
        return await this.orderService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateOrderSchema))
    async updateOrder(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.orderService.update(intId, body)
    }

    @Delete('/:id')
    async deleteOrder(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.orderService.delete(intId)
    }
}
