import { numberFromEmptyString, z } from '../utils/zod'

export const InventoryRecordSchema = z
    .object({
        id: z.number().int(),
        type: z.coerce.number().int(),
        total: z.coerce.number().int(),
        desc: z.string().nullish(),
        status: z.coerce.number().int().default(0),
        createdAt: z.date(),
        updatedAt: z.date(),
        commodityId: z.coerce.number().int(),
        warehouseId: z.coerce.number().int(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const CreateInventoryRecordSchema = InventoryRecordSchema
export const UpdateInventoryRecordSchema = InventoryRecordSchema.partial()

export type InventoryRecordSchema = z.infer<typeof InventoryRecordSchema>

export const InventoryRecordQuerySchema = z
    .object({
        id: z.number().int(),
        type: numberFromEmptyString(),
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

export type InventoryRecordQuerySchema = z.infer<typeof InventoryRecordQuerySchema>
