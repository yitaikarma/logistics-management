/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:28
 * @LastEditTime : 2025-03-14 21:30:34
 * @LastEditors  : Karma
 * @Description  : 认证中间件
 */
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'
import { prismaService } from '../services/prisma.service'
import { UnauthorizedError } from '../utils/errors'

// 扩展 Express Request 类型
declare global {
    namespace Express {
        interface Request {
            user?: User
            userId?: number
        }
    }
}

const prisma = prismaService.prisma

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        // 从请求头获取Authorization令牌
        const authHeader = req.headers.authorization

        // 检查 Authorization 头是否存在
        if (!authHeader) {
            throw new UnauthorizedError('认证失败', '当前接口需要认证才能访问。')
        }

        // 检查是否为 Bearer 令牌格式
        const parts = authHeader.split(' ')
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new UnauthorizedError('认证失败', '令牌格式无效，请使用 Bearer Token。')
        }

        const token = parts[1]

        // 验证 token 是否正确
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any

        if (!decoded) {
            throw new UnauthorizedError('认证失败', '无效的令牌')
        }

        // 查询一下，当前用户
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
        if (!user) {
            throw new UnauthorizedError('认证失败', '用户不存在')
        }

        // 如果通过验证，将 user 对象挂载到 req 上，方便后续中间件或路由使用
        req.user = user
        req.userId = user.id

        // 通过路由
        next()
    } catch (error) {
        next(error)
    }
}
