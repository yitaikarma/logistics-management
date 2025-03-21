import { numberFromEmptyString, z } from '../utils/zod'

export const InventorySchema = z
    .object({
        id: z.number().int(),
        type: numberFromEmptyString(),
        total: z.coerce.number().int(),
        desc: z.string().nullish(),
        status: z.coerce.number().int().default(0),
        createdAt: z.date(),
        updatedAt: z.date(),
        commodityId: z.coerce.number().int(),
        warehouseId: z.coerce.number().int(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const CreateInventorySchema = InventorySchema
export const UpdateInventorySchema = InventorySchema.partial()

export type InventorySchema = z.infer<typeof InventorySchema>

export const InventoryQuerySchema = z
    .object({
        id: z.number().int(),
        total: numberFromEmptyString(),
        desc: z.string().nullish(),
        status: numberFromEmptyString(),
        createdAt: z.date(),
        updatedAt: z.date(),
        commodityId: numberFromEmptyString(),
        warehouseId: numberFromEmptyString(),

        currentPage: numberFromEmptyString(),
        pageSize: numberFromEmptyString(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export type InventoryQuerySchema = z.infer<typeof InventoryQuerySchema>
