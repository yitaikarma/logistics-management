/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 仓库服务
 */

import { Warehouse, Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'

/** 过滤 */
const select = Prisma.validator<Prisma.WarehouseSelect>()({
    id: true,
    name: true,
    responsible: true,
    address: true,
    description: true,
    createdAt: true,
    updatedAt: true,
})

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.warehouse, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`公司不存在`)
    }

    return result
}

export class WarehouseService {
    private prisma = prismaService.prisma

    // 获取公司分页列表
    async findPageAll(currentPage: number = 1, pageSize: number = 10, name?: string) {
        const skip = (currentPage - 1) * pageSize

        const where: Prisma.WarehouseWhereInput = {
            name: { contains: name ?? '' },
        }
        const condition: Prisma.WarehouseFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where,
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.warehouse.count({ where }), this.prisma.warehouse.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取公司列表成功')
    }

    // 获取公司列表
    async findAll(name?: string) {
        const where: Prisma.WarehouseWhereInput = {
            name: { contains: name ?? '' },
        }

        const condition: Prisma.WarehouseFindManyArgs = {
            select,
            where,
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.warehouse.findMany(condition)

        return ResponseUtil.success(result, '获取公司列表成功')
    }

    // 通过ID查找公司
    async findById(id: number) {
        const result = await findTarget(this.prisma.warehouse, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取公司详情成功')
    }

    // 通过电子邮件查找公司
    async findByEmail(email: string) {
        const result = await findTarget(this.prisma.warehouse, {
            where: { email },
            select,
        })

        return ResponseUtil.success(result, '获取公司详情成功')
    }

    // 创建公司
    async create(data: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const result = await this.prisma.warehouse.create({ select, data })
            return ResponseUtil.success(result, '创建公司成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该公司已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新公司
    async update(id: number, data: Partial<Warehouse>) {
        await findTarget(this.prisma.warehouse, { where: { id } })

        try {
            const result = await this.prisma.warehouse.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新公司成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`公司ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该公司已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除公司
    async delete(id: number) {
        await findTarget(this.prisma.warehouse, { where: { id } })
        const result = await this.prisma.warehouse.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除公司成功')
    }
}
