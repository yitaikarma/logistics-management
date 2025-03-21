import { numberFromEmptyString, z } from '../utils/zod'

export const OrderSchema = z
    .object({
        id: z.number().int(),
        desc: z.string().nullish(),
        status: z.coerce.number().int(),
        createdAt: z.date(),
        updatedAt: z.date(),
        commodityId: z.coerce.number().int(),
        categoryId: z.coerce.number().int(),
        userId: z.coerce.number().int(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const CreateOrderSchema = OrderSchema
export const UpdateOrderSchema = OrderSchema.partial()

export type OrderSchema = z.infer<typeof OrderSchema>

export const OrderQuerySchema = z
    .object({
        id: z.number().int(),
        desc: z.string().nullish(),
        status: numberFromEmptyString(),
        createdAt: z.date(),
        updatedAt: z.date(),
        commodityId: numberFromEmptyString(),
        categoryId: numberFromEmptyString(),
        userId: numberFromEmptyString(),

        currentPage: numberFromEmptyString(),
        pageSize: numberFromEmptyString(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export type OrderQuerySchema = z.infer<typeof OrderQuerySchema>
