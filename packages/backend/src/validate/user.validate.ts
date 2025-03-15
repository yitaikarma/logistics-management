/*
 * @Author       : Karma
 * @Date         : 2025-03-13 20:35:59
 * @LastEditTime : 2025-03-15 02:39:58
 * @LastEditors  : Karma
 * @Description  :
 */
import { z } from '../utils/zod'

export const CreateUserSchema = z
    .object({
        id: z.number().int(),
        email: z.string().min(1, { message: '邮箱不能为空' }).email(),
        username: z.string().min(2, { message: '用户名长度不能小于2位' }).max(20, { message: '用户名长度不能大于20位' }),
        phone: z.string().length(11, { message: '手机号长度必须为11位' }).nullish(),
        password: z.string().min(4, { message: '密码长度不能小于4位' }).max(20, { message: '密码长度不能大于20位' }),
        nickname: z.string().min(2, { message: '昵称长度不能小于2位' }).max(20, { message: '昵称长度不能大于20位' }),
        gender: z.coerce
            .number()
            .int()
            .min(1, { message: '性别不能为空' })
            .refine(value => [0, 1, 2].includes(value), { message: '性别值不正确' }),
        avatar: z.string().url().or(z.literal('')).nullish(),
        role: z.coerce
            .number()
            .int()
            .min(1, { message: '角色不能为空' })
            .refine(value => [0, 10, 100].includes(value), { message: '角色值不正确' }),
        createdAt: z.date(),
        updatedAt: z.date(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const UpdateUserSchema = CreateUserSchema.partial()
