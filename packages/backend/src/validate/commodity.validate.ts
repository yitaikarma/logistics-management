import { numberFromEmptyString, z } from '../utils/zod'

export const CommoditySchema = z
    .object({
        id: z.number().int(),
        name: z.string().min(2, { message: '名称长度不能小于2位' }).max(20, { message: '名称长度不能大于20位' }),
        price: z.coerce.number(),
        desc: z.string().nullish(),
        status: z.coerce.number().int(),
        createdAt: z.date(),
        updatedAt: z.date(),
        categoryId: z.coerce.number().int(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const CreateCommoditySchema = CommoditySchema
export const UpdateCommoditySchema = CommoditySchema.partial()

export type CommoditySchema = z.infer<typeof CommoditySchema>

export const CommodityQuerySchema = z
    .object({
        id: z.number().int(),
        name: z.string().nullish(),
        price: numberFromEmptyString(),
        desc: z.string().nullish(),
        status: numberFromEmptyString(),
        createdAt: z.date(),
        updatedAt: z.date(),
        categoryId: numberFromEmptyString(),

        currentPage: numberFromEmptyString(),
        pageSize: numberFromEmptyString(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export type CommodityQuerySchema = z.infer<typeof CommodityQuerySchema>
