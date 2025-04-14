/*
 * @Author       : Karma
 * @Date         : 2025-03-13 20:35:59
 * @LastEditTime : 2025-03-15 02:39:58
 * @LastEditors  : Karma
 * @Description  :
 */
import { numberFromEmptyString, z } from '../utils/zod'

export const UserSchema = z
    .object({
        id: z.number().int(),
        email: z.string().min(1, { message: '邮箱不能为空' }).email(),
        username: z.string().min(2, { message: '用户名长度不能小于2位' }).max(20, { message: '用户名长度不能大于20位' }),
        phone: z.string().length(11, { message: '手机号长度必须为11位' }).nullish(),
        password: z.string().min(4, { message: '密码长度不能小于4位' }).max(20, { message: '密码长度不能大于20位' }),
        nickname: z.string().min(2, { message: '昵称长度不能小于2位' }).max(20, { message: '昵称长度不能大于20位' }).nullish(),
        gender: z.coerce
            .number()
            .int()
            .refine(value => [0, 1, 2].includes(value), { message: '性别值不正确' }),
        avatar: z.string().url().or(z.literal('')).nullish(),
        role: z.coerce.number().int(),
        roleId: z.coerce.number().int(),
        address: z.string().min(2, { message: '地址长度不能小于2位' }).max(100, { message: '地址长度不能大于100位' }).nullish(),
        desc: z.string().max(200, { message: '描述长度不能大于200位' }).nullish(),
        status: z.coerce
            .number()
            .int()
            .default(1)
            .refine(value => [0, 1].includes(value), { message: '状态值不正确' }),
        createdAt: z.date(),
        updatedAt: z.date(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const CreateUserSchema = UserSchema
export const UpdateUserSchema = UserSchema.partial()

export type UserSchema = z.infer<typeof UserSchema>

export const UserQuerySchema = z
    .object({
        id: z.number().int(),
        email: z.string().or(z.string().email()).nullish(),
        username: z.string().nullish(),
        phone: z.string().nullish(),
        password: z.string().nullish(),
        nickname: z.string().nullish(),
        gender: numberFromEmptyString(),
        avatar: z.string().url().nullish(),
        role: numberFromEmptyString(),
        roleId: numberFromEmptyString(),
        address: z.string().nullish(),
        desc: z.string().nullish(),
        status: numberFromEmptyString(),
        createdAt: z.date(),
        updatedAt: z.date(),

        currentPage: numberFromEmptyString(),
        pageSize: numberFromEmptyString(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export type UserQuerySchema = z.infer<typeof UserQuerySchema>
