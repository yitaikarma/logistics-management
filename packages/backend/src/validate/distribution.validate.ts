import { numberFromEmptyString, z } from '../utils/zod'

export const DistributionSchema = z
    .object({
        id: z.number().int(),
        name: z.string().min(2, '名称不能少于2个字符').max(50, '名称不能超过50个字符'),
        desc: z.string().nullish(),
        status: z.coerce.number().int(),
        createdAt: z.date(),
        updatedAt: z.date(),
        categoryId: z.coerce.number().int(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const CreateDistributionSchema = DistributionSchema
export const UpdateDistributionSchema = DistributionSchema.partial()

export type DistributionSchema = z.infer<typeof DistributionSchema>

export const DistributionQuerySchema = z
    .object({
        id: z.number().int(),
        name: z.string().nullish(),
        desc: z.string().nullish(),
        status: numberFromEmptyString(),
        createdAt: z.date(),
        updatedAt: z.date(),
        categoryId: numberFromEmptyString(),

        currentPage: numberFromEmptyString(),
        pageSize: numberFromEmptyString(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export type DistributionQuerySchema = z.infer<typeof DistributionQuerySchema>
