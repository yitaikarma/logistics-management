/*
 * @Author       : Karma
 * @Date         : 2025-03-12 17:39:16
 * @LastEditTime : 2025-03-15 02:44:00
 * @LastEditors  : Karma
 * @Description  : 错误处理中间件
 */
import { Request, Response, NextFunction } from 'express'
import { AppError, BadRequestError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library'
import { logger } from '../utils/logger'

export function errorHandlerMiddleware(error: Error, req: Request, res: Response, _next: NextFunction) {
    logger.error('-----------------------', error)
    logger.error('+++++++++++++++++++++++', req, res)

    // 处理 JSON Web Token 错误
    if (error.name === 'JsonWebTokenError') {
        ResponseUtil.error(res, 401, '认证失败', ['您提交的 token 错误'])
        return void 0
    }
    if (error.name === 'TokenExpiredError') {
        ResponseUtil.error(res, 401, '认证失败', ['您的 token 已过期'])
        return void 0
    }

    // 处理 AppError
    if (error instanceof AppError) {
        ResponseUtil.error(res, error.code, error.message, error.data)
        return void 0
    }

    // 处理 Prisma 错误
    if (error instanceof PrismaClientKnownRequestError) {
        // P2002 是唯一约束冲突
        if (error.code === 'P2002') {
            ResponseUtil.error(res, 400, `${error.meta?.target} 已存在`)
            return void 0
        }

        // P2025 是记录不存在
        if (error.code === 'P2025') {
            ResponseUtil.error(res, 404, '记录不存在')
            return void 0
        }
    }

    if (error instanceof PrismaClientValidationError || error instanceof BadRequestError) {
        ResponseUtil.error(res, 400, '参数错误', [error.message])
        return void 0
    }

    if (error instanceof BadRequestError) {
        ResponseUtil.error(res, 401, '认证错误', [error.message])
        return void 0
    }

    if (error instanceof NotFoundError) {
        ResponseUtil.error(res, 404, '资源不存在', [error.message])
        return void 0
    }

    if (error instanceof SyntaxError) {
        console.error('====== JSON 解析失败 ======')
        ResponseUtil.error(res, 400, 'JSON 解析失败', ['请求数据格式错误'])
    }

    // 其他未知错误
    ResponseUtil.error(res, ErrorCode.INTERNAL_ERROR, '服务器内部错误', [error.message])
}
