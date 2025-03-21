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
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { CreateUserSchema, UpdateUserSchema, UserQuerySchema } from '../validate/user.validate'

@Controller({ path: '/api/users' })
@UseMiddleware(authMiddleware)
export class UserController {
    private userService: UserService

    constructor() {
        this.userService = new UserService()
    }

    @Get('/page')
    @UseMiddleware(validateQuery(UserQuerySchema))
    async getPageAllUsers(@Query() query?: UserQuerySchema) {
        return await this.userService.findPageAll(query)
    }

    @Get()
    @UseMiddleware(validateQuery(UserQuerySchema))
    async getAllUsers(@Query() query?: UserQuerySchema) {
        return await this.userService.findAll(query)
    }

    @Get('/:id')
    async getUserById(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.userService.findById(intId)
    }

    @Post()
    @UseMiddleware(validateBody(CreateUserSchema))
    async createUser(@Body() body: any) {
        return await this.userService.create(body)
    }

    @Put('/:id')
    @UseMiddleware(validateBody(UpdateUserSchema))
    async updateUser(@Param('id') id: string, @Body() body: any) {
        const intId = parseInt(id, 10)
        return await this.userService.update(intId, body)
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        const intId = parseInt(id, 10)
        return await this.userService.delete(intId)
    }
}
