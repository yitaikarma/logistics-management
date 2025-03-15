import { z } from '../utils/zod'

export const CreateEmployeeSchema = z
    .object({
        id: z.number().int(),
        name: z.string().min(2, '员工姓名不能少于2个字符').max(50, '员工姓名不能超过50个字符'),
        gender: z.coerce
            .number()
            .int()
            .refine(value => [0, 1, 2].includes(value), { message: '性别只能是0或1' }),
        id_card: z.string().refine(value => /^\d{17}[\dXx]$/.test(value), { message: '身份证格式不正确' }),
        phone: z.string().nullish(),
        address: z.string().nullish(),
        description: z.string().nullish(),
        department: z.coerce.number().int(),
        createdAt: z.date(),
        updatedAt: z.date(),
    })
    .omit({ id: true, createdAt: true, updatedAt: true })

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial()

export type CreateEmployee = z.infer<typeof CreateEmployeeSchema>
export type UpdateEmployee = z.infer<typeof UpdateEmployeeSchema>
