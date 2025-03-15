/*
 * @Author       : Karma
 * @Date         : 2025-03-13 15:17:13
 * @LastEditTime : 2025-03-15 02:42:53
 * @LastEditors  : Karma
 * @Description  : 认证服务
 */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prismaService } from './prisma.service'
import { validateCreate } from '../validate/auth.validate'
import { NotFoundError, UnauthorizedError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'

const TOKEN: string = process.env.JWT_SECRET as string
const EXPIRES_IN = '30d'

export class AuthService {
    private prisma = prismaService.prisma

    async login(loginway: number, account: string, password: string) {
        const validData = validateCreate({ loginway, account, password })

        const where: { email?: string; username?: string; phone?: string } = {}

        // 匹配登录方式
        switch (validData.loginway) {
            case 0:
                where.email = validData.account
                break
            case 1:
                where.username = validData.account
                break
            case 2:
                where.phone = validData.account
                break
            default:
                throw new UnauthorizedError('验证失败', '无效的登录方式')
        }

        // 查询用户
        const result = await this.prisma.user.findFirst({ where })
        if (!result) {
            throw new NotFoundError('验证失败', '用户不存在，无法登录')
        }

        // 验证密码
        const isPasswordValid = bcrypt.compareSync(validData.password, result.password)
        if (!isPasswordValid) {
            throw new UnauthorizedError('验证失败', '密码错误')
        }

        // 验证是否管理员
        if (result.role !== 100) {
            throw new UnauthorizedError('验证失败', '您没有权限登录管理员后台')
        }

        // 生成身份验证令牌
        const token = jwt.sign({ userId: result.id }, TOKEN, { expiresIn: EXPIRES_IN })

        return ResponseUtil.success({ user: result, token }, '登录成功')
    }
}
