/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 人员服务
 */

import { Employee, Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'

/** 过滤 */
const select = Prisma.validator<Prisma.EmployeeSelect>()({
    id: true,
    name: true,
    gender: true,
    id_card: true,
    phone: true,
    address: true,
    description: true,
    department: true,
    createdAt: true,
    updatedAt: true,
})

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.employee, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`人员不存在`)
    }

    return result
}

export class EmployeeService {
    private prisma = prismaService.prisma

    // 获取人员分页列表
    async findPageAll(currentPage: number = 1, pageSize: number = 10, name?: string) {
        const skip = (currentPage - 1) * pageSize

        const where: Prisma.EmployeeWhereInput = {
            name: { contains: name ?? '' },
        }
        const condition: Prisma.EmployeeFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where,
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.employee.count({ where }), this.prisma.employee.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取人员列表成功')
    }

    // 获取人员列表
    async findAll(name?: string) {
        const where: Prisma.EmployeeWhereInput = {
            name: { contains: name ?? '' },
        }

        const condition: Prisma.EmployeeFindManyArgs = {
            select,
            where,
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.employee.findMany(condition)

        return ResponseUtil.success(result, '获取人员列表成功')
    }

    // 通过ID查找人员
    async findById(id: number) {
        const result = await findTarget(this.prisma.employee, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取人员详情成功')
    }

    // 通过电子邮件查找人员
    async findByEmail(email: string) {
        const result = await findTarget(this.prisma.employee, {
            where: { email },
            select,
        })

        return ResponseUtil.success(result, '获取人员详情成功')
    }

    // 创建人员
    async create(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const result = await this.prisma.employee.create({ select, data })
            return ResponseUtil.success(result, '创建人员成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该人员已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新人员
    async update(id: number, data: Partial<Employee>) {
        await findTarget(this.prisma.employee, { where: { id } })

        try {
            const result = await this.prisma.employee.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新人员成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`人员ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该人员已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除人员
    async delete(id: number) {
        await findTarget(this.prisma.employee, { where: { id } })
        const result = await this.prisma.employee.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除人员成功')
    }
}
