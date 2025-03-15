 
/*
 * @Author       : Karma
 * @Date         : 2025-03-14 00:29:35
 * @LastEditTime : 2025-03-15 02:31:43
 * @LastEditors  : Karma
 * @Description  : 权限字典控制器
 */

import { Controller, Get } from '../decorators/controller.decorator'
import { Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { RoleService } from '../services/role.service'
import { authMiddleware } from '../middlewares/auth.middleware'

@Controller({ path: '/api/enum/roles' })
@UseMiddleware(authMiddleware)
export class RoleController {
    private roleService: RoleService

    constructor() {
        this.roleService = new RoleService()
    }

    @Get('/page')
    async getPageAllRoles(@Query('currentPage') currentPage?: string, @Query('pageSize') pageSize?: string, @Query('name') name?: string) {
        const newCurrentPage = currentPage ? parseInt(currentPage, 10) : 1
        const newPageSize = pageSize ? parseInt(pageSize, 10) : 10
        return await this.roleService.findPageAll(newCurrentPage, newPageSize, name)
    }
    
    @Get()
    async getAllRoles(@Query('name') name?: string) {
        return await this.roleService.findAll(  name)
    }

    @Get('/:id')
    async getRoleById(@Param('id') id: string) {
        const roleId = parseInt(id, 10)
        return await this.roleService.findById(roleId)
    }
}
