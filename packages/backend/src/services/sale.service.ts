/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 销售服务
 */

import { Sale, Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'

/** 过滤 */
const select = Prisma.validator<Prisma.SaleSelect>()({
    id: true,
    commodity: true,
    company: true,
    count: true,
    price: true,
    total: true,
    account_number: true,
    phone: true,
    description: true,
    createdAt: true,
    updatedAt: true,
})

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.sale, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`销售不存在`)
    }

    return result
}

export class SaleService {
    private prisma = prismaService.prisma

    // 获取销售分页列表
    async findPageAll(currentPage: number = 1, pageSize: number = 10, commodity?: string) {
        const skip = (currentPage - 1) * pageSize

        const where: Prisma.SaleWhereInput = {
            commodity: { contains: commodity ?? '' },
        }
        const condition: Prisma.SaleFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where,
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.sale.count({ where }), this.prisma.sale.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取销售列表成功')
    }

    // 获取销售列表
    async findAll(commodity?: string) {
        const where: Prisma.SaleWhereInput = {
            commodity: { contains: commodity ?? '' },
        }

        const condition: Prisma.SaleFindManyArgs = {
            select,
            where,
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.sale.findMany(condition)

        return ResponseUtil.success(result, '获取销售列表成功')
    }

    // 通过ID查找销售
    async findById(id: number) {
        const result = await findTarget(this.prisma.sale, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取销售详情成功')
    }

    // 通过电子邮件查找销售
    async findByEmail(email: string) {
        const result = await findTarget(this.prisma.sale, {
            where: { email },
            select,
        })

        return ResponseUtil.success(result, '获取销售详情成功')
    }

    // 创建销售
    async create(data: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const result = await this.prisma.sale.create({ select, data })
            return ResponseUtil.success(result, '创建销售成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该销售已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新销售
    async update(id: number, data: Partial<Sale>) {
        await findTarget(this.prisma.sale, { where: { id } })

        try {
            const result = await this.prisma.sale.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新销售成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`销售ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该销售已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除销售
    async delete(id: number) {
        await findTarget(this.prisma.sale, { where: { id } })
        const result = await this.prisma.sale.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除销售成功')
    }
}
