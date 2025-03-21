import { numberFromEmptyString, z } from '../utils/zod'

export const DistributionCategorySchema = z
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

export const CreateDistributionCategorySchema = DistributionCategorySchema
export const UpdateDistributionCategorySchema = DistributionCategorySchema.partial()

export type DistributionCategorySchema = z.infer<typeof DistributionCategorySchema>

export const DistributionCategoryQuerySchema = z
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

export type DistributionCategoryQuerySchema = z.infer<typeof DistributionCategoryQuerySchema>
