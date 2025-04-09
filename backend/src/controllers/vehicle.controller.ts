/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 车辆控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { VehicleService } from '../services/vehicle.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { VehicleQuerySchema, CreateVehicleSchema, UpdateVehicleSchema } from '../validate/vehicle.validate'

@Controller({ path: '/api/vehicles' })
@UseMiddleware(authMiddleware)
export class VehicleController {
    private vehicleService: VehicleService

    constructor() {
        this.vehicleService = new VehicleService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(VehicleQuerySchema))
    async getPageAllVehicles(@Query() query?: VehicleQuerySchema) {
        return await this.vehicleService.findPageAll(query)
    }

    @Get()
    @UseMiddleware(validateBody(VehicleQuerySchema))
    async getAllVehicles(@Query() query?: VehicleQuerySchema) {
        return await this.vehicleService.findAll(query)
    }

    @Get('/:id')
    async getVehicleById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.vehicleService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateVehicleSchema))
    async createVehicle(@Body() body: any) {
        return await this.vehicleService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateVehicleSchema))
    async updateVehicle(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.vehicleService.update(intId, body)
    }

    @Delete('/:id')
    async deleteVehicle(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.vehicleService.delete(intId)
    }
}
