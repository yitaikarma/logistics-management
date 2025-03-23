import { numberFromEmptyString, z } from '../utils/zod'

export const WarehouseSchema = z
    .object({
        id: z.number().int(),
        name: z.string().min(2, '仓库名称不能少于2个字符').max(50, '仓库名称不能超过50个字符'),
        province: z.string(),
        city: z.string(),
        district: z.string(),
        address: z.string().nullish(),
        desc: z.string().nullish(),
        status: z.coerce.number().int(),
        createdAt: z.date(),
        updatedAt: z.date(),
        categoryId: z.coerce.number().int(),
        userId: z.coerce.number().int(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const CreateWarehouseSchema = WarehouseSchema
export const UpdateWarehouseSchema = WarehouseSchema.partial()

export type WarehouseSchema = z.infer<typeof WarehouseSchema>

export const WarehouseQuerySchema = z
    .object({
        id: z.number().int(),
        name: z.string().nullish(),
        province: z.string().nullish(),
        city: z.string().nullish(),
        district: z.string().nullish(),
        address: z.string().nullish(),
        desc: z.string().nullish(),
        status: numberFromEmptyString(),
        createdAt: z.date(),
        updatedAt: z.date(),
        categoryId: numberFromEmptyString(),
        userId: numberFromEmptyString(),

        currentPage: numberFromEmptyString(),
        pageSize: numberFromEmptyString(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export type WarehouseQuerySchema = z.infer<typeof WarehouseQuerySchema>
