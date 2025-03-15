import { z } from '../utils/zod'

export const CreateWarehouseSchema = z
    .object({
        id: z.number().int(),
        name: z.string().min(2, '仓库名称不能少于2个字符').max(50, '仓库名称不能超过50个字符'),
        responsible: z.string().nullish(),
        address: z.string().nullish(),
        description: z.string().nullish(),
        createdAt: z.date(),
        updatedAt: z.date(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const UpdateWarehouseSchema = CreateWarehouseSchema.partial()

export type CreateWarehouse = z.infer<typeof CreateWarehouseSchema>
export type UpdateWarehouse = z.infer<typeof UpdateWarehouseSchema>
