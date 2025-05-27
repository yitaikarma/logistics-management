/*
 * @Author       : Karma
 * @Date         : 2025-03-13 20:00:21
 * @LastEditTime : 2025-03-14 13:26:03
 * @LastEditors  : Karma
 * @Description  : 字段验证中间件
 */

import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AppError, ErrorCode } from '../utils/errors'

export function validateBody(schema: z.ZodType<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema
                .refine(data => {
                    // console.log('body', data)
                    return data
                })
                .parse(req.body)
            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('ZodError', error)
                // const errors = error.errors.map(e => ({  field: e.path.join('.'), message: e.message,  }))
                const errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
                next(new AppError('查询参数验证失败', ErrorCode.BAD_REQUEST, errors))
            } else {
                next(error)
            }
        }
    }
}

export function validateQuery(schema: z.ZodType<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.query = schema
                .refine(data => {
                    // console.log('query', data)
                    return data
                })
                .parse(req.query)
            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('ZodError', error)
                // const errors = error.errors.map(e => ({  field: e.path.join('.'), message: e.message,  }))
                const errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
                next(new AppError('查询参数验证失败', ErrorCode.BAD_REQUEST, errors))
            } else {
                next(error)
            }
        }
    }
}
