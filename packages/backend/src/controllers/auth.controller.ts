/*
 * @Author       : Karma
 * @Date         : 2025-03-13 14:21:03
 * @LastEditTime : 2025-03-14 04:21:50
 * @LastEditors  : Karma
 * @Description  : 认证控制器
 */

import { Controller, Post } from '../decorators/controller.decorator'
import { Body } from '../decorators/param.decorator'
import { AuthService } from '../services/auth.service'

@Controller({ path: '/api/auth' })
// @UseMiddleware(authMiddleware)
export class AuthController {
    private authService: AuthService

    constructor() {
        this.authService = new AuthService()
    }

    @Post('/login')
    async login(@Body('loginway') loginway: number, @Body('account') email: string, @Body('password') password: string) {
        return await this.authService.login(loginway, email, password)
    }
}
