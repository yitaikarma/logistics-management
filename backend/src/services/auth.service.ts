/*
 * @Author       : Karma
 * @Date         : 2025-03-13 15:17:13
 * @LastEditTime : 2025-03-15 02:42:53
 * @LastEditors  : Karma
 * @Description  : 认证服务
 */

import { Request } from 'express'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prismaService } from './prisma.service'
import { NotFoundError, UnauthorizedError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { AuthApplyEmailSchema, AuthBodySchema, AuthQuerySchema, AuthResetPasswordSchema } from '../validate/auth.validate'

const TOKEN: string = process.env.JWT_SECRET as string
const EXPIRES_IN = '30d'

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.user, condition: any, msg = '用户已存在，无法注册') {
    const result = await model.findFirst(condition)

    if (result) {
        throw new NotFoundError(msg)
    }

    return result
}

export class AuthService {
    private prisma = prismaService.prisma

    // 用户重复验证
    async checkRepeat(params: AuthQuerySchema) {
        try {
            const result = await this.prisma.user.findFirst({
                where: {
                    // OR: [{ username: params.username }, { email: params.email }, { phone: params.phone }],
                    // OR: [{ username: params.username }],
                    username: params.username,
                },
            })
            console.log('99999999999999', params, result)

            if (result) {
                return new UnauthorizedError('用户已存在')
            }

            return ResponseUtil.success(result, '验证成功')
        } catch (error) {
            console.log('验证失败', error)
            return ResponseUtil.success(error, '验证失败')
        }
    }

    // 注册
    async signup(data: AuthBodySchema) {
        await findTarget(this.prisma.user, {
            where: { OR: [{ username: data.username }, { email: data.email }, { phone: data.phone }] },
        })

        data.password = bcrypt.hashSync(data.password, 10)

        const result = await this.prisma.user.create({ data: { ...data, status: 0 } })

        return ResponseUtil.success(result, '注册成功')
    }

    // 登录
    async signin(data: AuthBodySchema) {
        const where: Prisma.UserWhereInput = {
            OR: [
                {
                    username: data.username ?? undefined,
                },
                { email: data.email ?? undefined },
                { phone: data.phone ?? undefined },
            ],
        }

        // 查询用户
        const result = await this.prisma.user.findFirst({ where })
        if (!result) {
            throw new NotFoundError('用户不存在，无法登录')
        }

        // 验证密码
        const isPasswordValid = bcrypt.compareSync(data.password, result.password!)
        if (!isPasswordValid) {
            throw new UnauthorizedError('密码错误')
        }

        // 验证是否管理员
        // if (result.role !== 100) {
        //     throw new UnauthorizedError('验证失败', '您没有权限登录管理员后台')
        // }

        await prismaService.prisma.user.update({
            where: { id: result.id },
            data: { status: 1 },
        })

        // 生成身份验证令牌
        const token = jwt.sign({ userId: result.id }, TOKEN, { expiresIn: EXPIRES_IN })

        return ResponseUtil.success({ user: result, token }, '登录成功')
    }

    // 申请重置密码
    async applyResetPassword(data: AuthApplyEmailSchema) {
        const result = await this.prisma.user.findFirst({ where: { email: data.email } })
        if (!result) {
            throw new NotFoundError('申请失败, 用户不存在')
        }
        return ResponseUtil.success({ token: result.password, username: result.username }, '申请成功')
    }

    // 重置密码
    async resetPassword(data: AuthResetPasswordSchema) {
        const result = await this.prisma.user.update({
            where: { username: data.username },
            data: { password: bcrypt.hashSync(data.password, 10) },
        })
        return ResponseUtil.success(result, '重置成功')
    }

    // 退出登录
    async signout(req: Request) {
        await prismaService.prisma.user.update({
            where: { id: req.userId },
            data: { status: 2 },
        })

        return ResponseUtil.success(null, '已退出登录')
    }
}
