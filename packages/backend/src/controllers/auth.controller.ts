/*
 * @Author       : Karma
 * @Date         : 2025-03-13 14:21:03
 * @LastEditTime : 2025-03-14 04:21:50
 * @LastEditors  : Karma
 * @Description  : 认证控制器
 */

import { Request } from 'express'
import { Controller, Post, Get } from '../decorators/controller.decorator'
import { Body, Query, Req } from '../decorators/param.decorator'
import { AuthService } from '../services/auth.service'
import { UseMiddleware } from '../decorators/middleware.decorator'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateBody, validateQuery } from '../middlewares/validate.middleware'
import { AuthApplyEmailSchema, AuthBodySchema, AuthQuerySchema, AuthResetPasswordSchema } from '../validate/auth.validate'

@Controller({ path: '/api/auth' })
export class AuthController {
    private authService: AuthService

    constructor() {
        this.authService = new AuthService()
    }

    @Get('/checkRepeat')
    @UseMiddleware(validateQuery(AuthQuerySchema))
    async checkRepeat(@Query() query: AuthQuerySchema) {
        return await this.authService.checkRepeat(query)
    }

    @Post('/signup')
    @UseMiddleware(validateBody(AuthBodySchema))
    async signup(@Body() data: AuthBodySchema) {
        return await this.authService.signup(data)
    }

    @Post('/signin')
    @UseMiddleware(validateBody(AuthBodySchema))
    async signin(@Body() data: AuthBodySchema) {
        return await this.authService.signin(data)
    }

    @Post('/applyResetPassword')
    @UseMiddleware(validateBody(AuthApplyEmailSchema))
    async applyResetPassword(@Body() data: AuthApplyEmailSchema) {
        return await this.authService.applyResetPassword(data)
    }

    @Post('/resetPassword')
    @UseMiddleware(validateBody(AuthResetPasswordSchema))
    async resetPassword(@Body() data: AuthResetPasswordSchema) {
        return await this.authService.resetPassword(data)
    }

    @Get('/signout')
    @UseMiddleware(authMiddleware)
    async signout(@Req() req: Request) {
        return await this.authService.signout(req)
    }
}
