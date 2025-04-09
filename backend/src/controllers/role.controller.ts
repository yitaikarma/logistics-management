/*
 * @Author       : Karma
 * @Date         : 2025-03-14 00:29:35
 * @LastEditTime : 2025-03-15 02:31:43
 * @LastEditors  : Karma
 * @Description  : 权限字典控制器
 */

import { Controller, Delete, Get, Post, Put } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { RoleService } from '../services/role.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { CreateRoleSchema, RoleQuerySchema, UpdateRoleSchema } from '../validate/role.validate'

@Controller({ path: '/api/roles' })
@UseMiddleware(authMiddleware)
export class RoleController {
    private roleService: RoleService

    constructor() {
        this.roleService = new RoleService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(RoleQuerySchema))
    async getPageAllRoles(@Query() query?: RoleQuerySchema) {
        return await this.roleService.findPageAll(query)
    }

    @Get()
    @UseMiddleware(validateQuery(RoleQuerySchema))
    async getAllRoles(@Query() query?: RoleQuerySchema) {
        return await this.roleService.findAll(query)
    }

    @Get('/:id')
    async getRoleById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.roleService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateRoleSchema))
    async addRole(@Body() body: any) {
        return await this.roleService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateRoleSchema))
    async updateUser(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.roleService.update(intId, body)
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.roleService.delete(intId)
    }
}
