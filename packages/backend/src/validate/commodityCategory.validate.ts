/*
 * @Author       : Karma
 * @Date         : 2025-03-13 20:35:59
 * @LastEditTime : 2025-03-15 02:39:58
 * @LastEditors  : Karma
 * @Description  : 商品分类验证
 */
import { numberFromEmptyString, z } from '../utils/zod'

export const CommodityCategorySchema = z
    .object({
        id: z.number().int(),
        name: z.string().min(2, { message: '名称长度不能小于2位' }).max(20, { message: '名称长度不能大于20位' }),
        desc: z.string().max(200, { message: '描述长度不能大于200位' }).nullish(),
        status: z.coerce
            .number()
            .int()
            .refine(value => [0, 1].includes(value), { message: '状态值不正确' }),
        createdAt: z.date(),
        updatedAt: z.date(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const CreateCommodityCategorySchema = CommodityCategorySchema
export const UpdateCommodityCategorySchema = CommodityCategorySchema.partial()

export type CommodityCategorySchema = z.infer<typeof CommodityCategorySchema>

export const CommodityCategoryQuerySchema = z
    .object({
        id: z.number().int(),
        name: z.string().nullish(),
        desc: z.string().nullish(),
        status: numberFromEmptyString(),
        createdAt: z.date(),
        updatedAt: z.date(),

        currentPage: numberFromEmptyString(),
        pageSize: numberFromEmptyString(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export type CommodityCategoryQuerySchema = z.infer<typeof CommodityCategoryQuerySchema>
