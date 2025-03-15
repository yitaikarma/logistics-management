/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:45
 * @LastEditTime : 2025-03-15 02:36:39
 * @LastEditors  : Karma
 * @Description  : 用户控制器
 */

import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator'
import { Body, Param, Query } from '../decorators/param.decorator'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { UserService } from '../services/user.service'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody } from '../middlewares/validate.middleware'
import { CreateUserSchema, UpdateUserSchema } from '../validate/user.validate'

@Controller({ path: '/api/users' })
@UseMiddleware(authMiddleware)
export class UserController {
    private userService: UserService

    constructor() {
        this.userService = new UserService()
    }

    @Get('/page')
    async getPageAllUsers(@Query('currentPage') currentPage?: string, @Query('pageSize') pageSize?: string, @Query('email') email?: string, @Query('username') username?: string) {
        const newCurrentPage = currentPage ? parseInt(currentPage, 10) : 1
        const newPageSize = pageSize ? parseInt(pageSize, 10) : 10
        return await this.userService.findPageAll(newCurrentPage, newPageSize, username, email)
    }

    @Get()
    async getAllUsers(@Query('email') email?: string, @Query('username') username?: string) {
        return await this.userService.findAll(username, email)
    }

    @Get('/:id')
    async getUserById(@Param('id') id: string) {
        const userId = parseInt(id, 10)
        return await this.userService.findById(userId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateUserSchema))
    async createUser(@Body() userData: any) {
        return await this.userService.create(userData)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateUserSchema))
    async updateUser(@Param('id') id: string, @Body() userData: any) {
        const userId = parseInt(id, 10)
        return await this.userService.update(userId, userData)
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        const userId = parseInt(id, 10)
        return await this.userService.delete(userId)
    }
}
