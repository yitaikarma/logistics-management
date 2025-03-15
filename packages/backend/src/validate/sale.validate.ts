import { z } from '../utils/zod'

export const CreateSaleSchema = z
    .object({
        id: z.number().int(),
        commodity: z.string().min(2, '商品名称不能少于2个字符').max(50, '商品名称不能超过50个字符'),
        company: z.string().min(2, '公司名称不能少于2个字符').max(50, '公司名称不能超过50个字符'),
        count: z.coerce.number().int(),
        price: z.coerce.number(),
        total: z.coerce.number(),
        account_number: z.string().refine(val => val.length === 16, { message: '账号长度必须为16位' }),
        phone: z.string().nullish(),
        description: z.string().nullish(),
        createdAt: z.date(),
        updatedAt: z.date(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const UpdateSaleSchema = CreateSaleSchema.partial()

export type CreateSale = z.infer<typeof CreateSaleSchema>
export type UpdateSale = z.infer<typeof UpdateSaleSchema>
