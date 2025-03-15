/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 人员控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { EmployeeService } from '../services/employee.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody } from '../middlewares/validate.middleware'
import { CreateEmployeeSchema, UpdateEmployeeSchema } from '../validate/employee.validate'

@Controller({ path: '/api/employees' })
@UseMiddleware(authMiddleware)
export class EmployeeController {
    private employeeService: EmployeeService

    constructor() {
        this.employeeService = new EmployeeService()
    }

    @Get('/page')
    async getPageAllEmployees(@Query('currentPage') currentPage?: string, @Query('pageSize') pageSize?: string, @Query('name') name?: string) {
        const newCurrentPage = currentPage ? parseInt(currentPage, 10) : 1
        const newPageSize = pageSize ? parseInt(pageSize, 10) : 10
        return await this.employeeService.findPageAll(newCurrentPage, newPageSize, name)
    }

    @Get()
    async getAllEmployees(@Query('name') name?: string) {
        return await this.employeeService.findAll(name)
    }

    @Get('/:id')
    async getEmployeeById(@Param('id') id: string) {
        const employeeId = parseInt(id, 10)
        return await this.employeeService.findById(employeeId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateEmployeeSchema))
    async createEmployee(@Body() employeeData: any) {
        return await this.employeeService.create(employeeData)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateEmployeeSchema))
    async updateEmployee(@Param('id') id: string, @Body() employeeData: any) {
        const employeeId = parseInt(id, 10)
        return await this.employeeService.update(employeeId, employeeData)
    }

    @Delete('/:id')
    async deleteEmployee(@Param('id') id: string) {
        const employeeId = parseInt(id, 10)
        return await this.employeeService.delete(employeeId)
    }
}
