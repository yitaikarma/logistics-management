/*
 * @Author       : Karma
 * @Date         : 2025-03-14 03:00:50
 * @LastEditTime : 2025-03-15 02:39:00
 * @LastEditors  : Karma
 * @Description  : 认证验证
 */

import { z } from '../utils/zod'
import { AppError, ErrorCode } from '../utils/errors'

// 登录方式 0: 邮箱 1: 用户名 2: 手机号

export const CreateSchema = z.object({
    loginway: z.coerce
        .number()
        .int()
        .refine(value => [0, 1, 2].includes(value), { message: '无效的登录方式，有效值为：[ 邮箱: 0, 用户名: 1 ,手机号: 2 ]' }),
    account: z
        .string()
        .email({ message: '请输入正确的邮箱地址' })
        .or(z.string().min(2, { message: '用户名长度不能小于2位' }).max(20, { message: '用户名长度不能大于20位' })),
    password: z.string().min(6, { message: '密码长度不能小于6位' }).max(20, { message: '密码长度不能大于20位' }),
})

export type CreateInput = z.infer<typeof CreateSchema>

export function validateCreate(data: unknown) {
    try {
        return CreateSchema.parse(data)
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log('error.errors', error)

            throw new AppError(
                '登录验证失败',
                ErrorCode.BAD_REQUEST,
                error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
            )
        }
        throw error
    }
}
