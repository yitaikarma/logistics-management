import { numberFromEmptyString, z } from '../utils/zod'

export const DistributionSchema = z
    .object({
        id: z.number().int(),
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
