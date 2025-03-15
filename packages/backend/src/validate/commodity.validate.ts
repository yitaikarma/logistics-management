import { z } from '../utils/zod'

export const CreateCommoditySchema = z
    .object({
        id: z.number().int(),
        name: z.string().min(2, { message: '商品名称长度不能小于2位' }).max(20, { message: '商品名称长度不能大于20位' }),
        price: z.coerce.number(),
        total: z.coerce.number().int(),
        description: z.string().nullish(),
        createdAt: z.date(),
        updatedAt: z.date(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const UpdateCommoditySchema = CreateCommoditySchema.partial()

export type CreateCommodity = z.infer<typeof CreateCommoditySchema>
export type UpdateCommodity = z.infer<typeof UpdateCommoditySchema>
