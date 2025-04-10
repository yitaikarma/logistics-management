/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 订单分类服务
 */

import { OrderCategory, Prisma } from '@prisma.client'
import { PrismaClientKnownRequestError } from '@prisma.client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { OrderCategoryQuerySchema } from 'src/validate/orderCategory.validate'

/** 过滤 */
const select = Prisma.validator<Prisma.OrderCategorySelect>()({
    id: true,
    name: true,
    desc: true,
    status: true,
    createdAt: true,
    updatedAt: true,
})

/** 查询参数 */
function findParams(params?: OrderCategoryQuerySchema) {
    return {
        name: { contains: params?.name || undefined },
        desc: { contains: params?.desc || undefined },
        status: { equals: params?.status },
    } as Prisma.OrderCategoryWhereInput
}

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.orderCategory, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`订单分类不存在`)
    }

    return result
}

export class OrderCategoryService {
    private prisma = prismaService.prisma

    // 获取订单分类分页列表
    async findPageAll(params?: OrderCategoryQuerySchema) {
        let { currentPage, pageSize } = params ?? {}
        currentPage ??= 1
        pageSize ??= 10
        const skip = (currentPage - 1) * pageSize

        const condition: Prisma.OrderCategoryFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where: findParams(params),
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.orderCategory.count({ where: findParams(params) }), this.prisma.orderCategory.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取订单分类列表成功')
    }

    // 获取订单分类列表
    async findAll(params?: OrderCategoryQuerySchema) {
        const condition: Prisma.OrderCategoryFindManyArgs = {
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.orderCategory.findMany(condition)

        return ResponseUtil.success(result, '获取订单分类列表成功')
    }

    // 通过ID查找订单分类
    async findById(id: number) {
        const result = await findTarget(this.prisma.orderCategory, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取订单分类详情成功')
    }

    // 创建订单分类
    async create(data: Omit<OrderCategory, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const result = await this.prisma.orderCategory.create({ select, data })
            return ResponseUtil.success(result, '创建订单分类成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该订单分类已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新订单分类
    async update(id: number, data: Partial<OrderCategory>) {
        await findTarget(this.prisma.orderCategory, { where: { id } })

        try {
            const result = await this.prisma.orderCategory.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新订单分类成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`订单分类ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该订单分类已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除订单分类
    async delete(id: number) {
        await findTarget(this.prisma.orderCategory, { where: { id } })
        const result = await this.prisma.orderCategory.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除订单分类成功')
    }
}
