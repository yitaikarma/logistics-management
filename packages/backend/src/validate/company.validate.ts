import { z } from '../utils/zod'

export const CreateCompanySchema = z
    .object({
        id: z.number().int(),
        name: z.string().min(2, '公司名称不能少于2个字符').max(50, '公司名称不能超过50个字符'),
        phone: z.string().nullish(),
        address: z.string().nullish(),
        description: z.string().nullish(),
        createdAt: z.date(),
        updatedAt: z.date(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const UpdateCompanySchema = CreateCompanySchema.partial()

export type CreateCompany = z.infer<typeof CreateCompanySchema>
export type UpdateCompany = z.infer<typeof UpdateCompanySchema>
