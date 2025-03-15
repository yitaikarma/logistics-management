/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 商品服务
 */

import { Commodity, Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'

/** 过滤 */
const select = Prisma.validator<Prisma.CommoditySelect>()({
    id: true,
    name: true,
    price: true,
    total: true,
    description: true,
    createdAt: true,
    updatedAt: true,
})

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.commodity, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`商品不存在`)
    }

    return result
}

export class CommodityService {
    private prisma = prismaService.prisma

    // 获取商品分页列表
    async findPageAll(currentPage: number = 1, pageSize: number = 10, name?: string ) {
        const skip = (currentPage - 1) * pageSize

        const where: Prisma.CommodityWhereInput = {
            name: { contains: name ?? '' },
        }
        const condition: Prisma.CommodityFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where,
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.commodity.count({ where }), this.prisma.commodity.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取商品列表成功')
    }

    // 获取商品列表
    async findAll(name?: string) {
        const where: Prisma.CommodityWhereInput = {
            name: { contains: name ?? '' },
        }
      
        const condition: Prisma.CommodityFindManyArgs = {
            select,
            where,
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.commodity.findMany(condition)

        return ResponseUtil.success(result, '获取商品列表成功')
    }

    // 通过ID查找商品
    async findById(id: number) {
        const result = await findTarget(this.prisma.commodity, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取商品详情成功')
    }

    // 通过电子邮件查找商品
    async findByEmail(email: string) {
        const result = await findTarget(this.prisma.commodity, {
            where: { email },
            select,
        })

        return ResponseUtil.success(result, '获取商品详情成功')
    }

    // 创建商品
    async create(data: Omit<Commodity, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const result = await this.prisma.commodity.create({ select, data })
            return ResponseUtil.success(result, '创建商品成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该商品已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新商品
    async update(id: number, data: Partial<Commodity>) {
        await findTarget(this.prisma.commodity, { where: { id } })

        try {
            const result = await this.prisma.commodity.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新商品成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`商品ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该商品已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除商品
    async delete(id: number) {
        await findTarget(this.prisma.commodity, { where: { id } })
        const result = await this.prisma.commodity.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除商品成功')
    }
}
