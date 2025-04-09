/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 车辆分类控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { VehicleCategoryService } from '../services/vehicleCategory.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { VehicleCategoryQuerySchema, CreateVehicleCategorySchema, UpdateVehicleCategorySchema } from '../validate/vehicleCategory.validate'

@Controller({ path: '/api/vehicleCategories' })
@UseMiddleware(authMiddleware)
export class VehicleCategoryController {
    private vehicleCategoryService: VehicleCategoryService

    constructor() {
        this.vehicleCategoryService = new VehicleCategoryService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(VehicleCategoryQuerySchema))
    async getPageAllVehicleCategories(@Query() query?: VehicleCategoryQuerySchema) {
        return await this.vehicleCategoryService.findPageAll(query)
    }

    @Get()
    @UseMiddleware(validateBody(VehicleCategoryQuerySchema))
    async getAllVehicleCategories(@Query() query?: VehicleCategoryQuerySchema) {
        return await this.vehicleCategoryService.findAll(query)
    }

    @Get('/:id')
    async getVehicleCategoryById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.vehicleCategoryService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateVehicleCategorySchema))
    async createVehicleCategory(@Body() body: any) {
        return await this.vehicleCategoryService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateVehicleCategorySchema))
    async updateVehicleCategory(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.vehicleCategoryService.update(intId, body)
    }

    @Delete('/:id')
    async deleteVehicleCategory(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.vehicleCategoryService.delete(intId)
    }
}
