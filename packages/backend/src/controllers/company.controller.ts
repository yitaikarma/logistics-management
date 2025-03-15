/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:50:50
 * @LastEditors  : Karma
 * @Description  : 公司控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { CompanyService } from '../services/company.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody } from '../middlewares/validate.middleware'
import { CreateCompanySchema, UpdateCompanySchema } from '../validate/company.validate'

@Controller({ path: '/api/companies' })
@UseMiddleware(authMiddleware)
export class CompanyController {
    private companyService: CompanyService

    constructor() {
        this.companyService = new CompanyService()
    }

    @Get('/page')
    async getPageAllCompanies(@Query('currentPage') currentPage?: string, @Query('pageSize') pageSize?: string, @Query('name') name?: string) {
        const newCurrentPage = currentPage ? parseInt(currentPage, 10) : 1
        const newPageSize = pageSize ? parseInt(pageSize, 10) : 10
        return await this.companyService.findPageAll(newCurrentPage, newPageSize, name)
    }

    @Get()
    async getAllCompanies(@Query('name') name?: string) {
        return await this.companyService.findAll(name)
    }

    @Get('/:id')
    async getCompanyById(@Param('id') id: string) {
        const companyId = parseInt(id, 10)
        return await this.companyService.findById(companyId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateCompanySchema))
    async createCompany(@Body() companyData: any) {
        return await this.companyService.create(companyData)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateCompanySchema))
    async updateCompany(@Param('id') id: string, @Body() companyData: any) {
        const companyId = parseInt(id, 10)
        return await this.companyService.update(companyId, companyData)
    }

    @Delete('/:id')
    async deleteCompany(@Param('id') id: string) {
        const companyId = parseInt(id, 10)
        return await this.companyService.delete(companyId)
    }
}
