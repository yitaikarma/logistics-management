/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 销售控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { SaleService } from '../services/sale.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody } from '../middlewares/validate.middleware'
import { CreateSaleSchema, UpdateSaleSchema } from '../validate/sale.validate'

@Controller({ path: '/api/sales' })
@UseMiddleware(authMiddleware)
export class SaleController {
    private saleService: SaleService

    constructor() {
        this.saleService = new SaleService()
    }

    @Get('/page')
    async getPageAllSales(@Query('currentPage') currentPage?: string, @Query('pageSize') pageSize?: string, @Query('commodity') commodity?: string) {
        const newCurrentPage = currentPage ? parseInt(currentPage, 10) : 1
        const newPageSize = pageSize ? parseInt(pageSize, 10) : 10
        return await this.saleService.findPageAll(newCurrentPage, newPageSize, commodity)
    }

    @Get()
    async getAllSales(@Query('commodity') commodity?: string) {
        return await this.saleService.findAll(commodity)
    }

    @Get('/:id')
    async getSaleById(@Param('id') id: string) {
        const saleId = parseInt(id, 10)
        return await this.saleService.findById(saleId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateSaleSchema))
    async createSale(@Body() saleData: any) {
        return await this.saleService.create(saleData)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateSaleSchema))
    async updateSale(@Param('id') id: string, @Body() saleData: any) {
        const saleId = parseInt(id, 10)
        return await this.saleService.update(saleId, saleData)
    }

    @Delete('/:id')
    async deleteSale(@Param('id') id: string) {
        const saleId = parseInt(id, 10)
        return await this.saleService.delete(saleId)
    }
}
