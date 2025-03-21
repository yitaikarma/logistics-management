import { numberFromEmptyString, z } from '../utils/zod'

export const VehicleSchema = z
    .object({
        id: z.number().int(),
        name: z.string().min(2, '名称不能少于2个字符').max(50, '名称不能超过50个字符'),
        license: z.string().min(2, '车牌号不能少于2个字符').max(50, '车牌号不能超过10个字符'),
        desc: z.string().nullish(),
        status: z.coerce.number().int(),
        createdAt: z.date(),
        updatedAt: z.date(),
        categoryId: z.coerce.number().int(),
        userId: z.coerce.number().int().nullish(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const CreateVehicleSchema = VehicleSchema
export const UpdateVehicleSchema = VehicleSchema.partial()

export type VehicleSchema = z.infer<typeof VehicleSchema>

export const VehicleQuerySchema = z
    .object({
        id: z.number().int(),
        name: z.string().nullish(),
        license: z.string().nullish(),
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

export type VehicleQuerySchema = z.infer<typeof VehicleQuerySchema>
