/*
 * @Author       : Karma
 * @Date         : 2025-03-13 20:35:59
 * @LastEditTime : 2025-03-15 02:39:58
 * @LastEditors  : Karma
 * @Description  : 权限验证
 */
import { numberFromEmptyString, z } from '../utils/zod'

export const RoleSchema = z
    .object({
        id: z.number().int(),
        name: z.string().min(2, { message: '名称长度不能小于2位' }).max(20, { message: '名称长度不能大于20位' }),
        value: z.coerce.number().int(),
        pageAuthString: z.string().nullish(),
        desc: z.string().max(200, { message: '描述长度不能大于200位' }).nullish(),
        status: z.coerce
            .number()
            .int()
            .refine(value => [0, 1].includes(value), { message: '状态值不正确' }),
        createdAt: z.date(),
        updatedAt: z.date(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const CreateRoleSchema = RoleSchema
export const UpdateRoleSchema = RoleSchema.partial()

export type RoleSchema = z.infer<typeof RoleSchema>

export const RoleQuerySchema = z
    .object({
        id: z.number().int(),
        name: z.string().nullish(),
        value: numberFromEmptyString(),
        pageAuthString: z.string().nullish(),
        desc: z.string().nullish(),
        status: numberFromEmptyString(),
        createdAt: z.date(),
        updatedAt: z.date(),

        currentPage: numberFromEmptyString(),
        pageSize: numberFromEmptyString(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export type RoleQuerySchema = z.infer<typeof RoleQuerySchema>
