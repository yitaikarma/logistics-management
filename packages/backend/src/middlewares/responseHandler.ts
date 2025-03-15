/*
 * @Author       : Karma
 * @Date         : 2025-03-12 17:39:07
 * @LastEditTime : 2025-03-12 20:41:30
 * @LastEditors  : Karma
 * @Description  :
 */
import { Request, Response, NextFunction } from 'express'
import { ResponseUtil } from '../utils/response'

export function responseHandler(req: Request, res: Response, next: NextFunction) {
    // 扩展 Response 对象，添加自定义方法
    const originalJson = res.json
    const originalSend = res.send

    // 覆盖原有的 json 方法
    res.json = function (body?: any): Response {
        // 如果已经是标准响应格式，就不再包装
        if (body && body.code !== undefined && body.success !== undefined) {
            return originalJson.call(this, body)
        }
        return originalJson.call(this, ResponseUtil.success(body))
    }

    // 覆盖原有的 send 方法
    res.send = function (body?: any): Response {
        if (typeof body === 'object' && body !== null && !(body instanceof Buffer)) {
            if (body && body.code !== undefined && body.success !== undefined) {
                return originalSend.call(this, body)
            }
            return originalSend.call(this, ResponseUtil.success(body))
        }
        return originalSend.call(this, body)
    }

    // 添加自定义成功响应方法
    res.success = function (data: any, message?: string, code?: number): Response {
        return originalJson.call(this, ResponseUtil.success(data, message, code))
    }

    // 添加自定义错误响应方法
    res.error = function (message?: string, code?: number, errors?: any): Response {
        return originalJson.call(this, ResponseUtil.error(code, errors))
    }

    next()
}

// 类型扩展
declare global {
    namespace Express {
        interface Response {
            success(data: any, message?: string, code?: number): Response
            error(message?: string, code?: number, errors?: any): Response
        }
    }
}
