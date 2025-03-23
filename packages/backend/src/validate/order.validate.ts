import { numberFromEmptyString, z } from '../utils/zod'

export const OrderSchema = z
    .object({
        id: z.number().int(),
        fromProvince: z.string().nullish(),
        fromCity: z.string().nullish(),
        fromDistrict: z.string().nullish(),
        fromAddress: z.string().nullish(),
        toProvince: z.string(),
        toCity: z.string(),
        toDistrict: z.string(),
        toAddress: z.string().nullish(),
        receiver: z.string(),
        phone: z.string(),
        total: z.number().int(),
        desc: z.string().nullish(),
        status: z.coerce.number().int(),
        createdAt: z.date(),
        updatedAt: z.date(),
        categoryId: z.coerce.number().int(),
        userId: z.coerce.number().int(),
        inventoryId: numberFromEmptyString(),
        warehouseId: numberFromEmptyString(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const CreateOrderSchema = OrderSchema
export const UpdateOrderSchema = OrderSchema.partial()

export type OrderSchema = z.infer<typeof OrderSchema>

export const OrderQuerySchema = z
    .object({
        id: z.number().int(),
        fromProvince: z.string().nullish(),
        fromCity: z.string().nullish(),
        fromDistrict: z.string().nullish(),
        toProvince: z.string().nullish(),
        toCity: z.string().nullish(),
        toDistrict: z.string().nullish(),
        fromAddress: z.string().nullish(),
        toAddress: z.string().nullish(),
        receiver: z.string().nullish(),
        phone: z.string().nullish(),
        total: numberFromEmptyString(),
        desc: z.string().nullish(),
        status: numberFromEmptyString(),
        createdAt: z.date(),
        updatedAt: z.date(),
        categoryId: numberFromEmptyString(),
        userId: numberFromEmptyString(),
        inventoryId: numberFromEmptyString(),
        warehouseId: numberFromEmptyString(),

        currentPage: numberFromEmptyString(),
        pageSize: numberFromEmptyString(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export type OrderQuerySchema = z.infer<typeof OrderQuerySchema>
