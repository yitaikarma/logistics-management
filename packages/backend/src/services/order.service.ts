/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 订单服务
 */

import { Order, Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { OrderQuerySchema } from 'src/validate/order.validate'

/** 过滤 */
const select = Prisma.validator<Prisma.OrderSelect>()({
    id: true,
    fromProvince: true,
    fromCity: true,
    fromDistrict: true,
    fromAddress: true,
    toProvince: true,
    toCity: true,
    toDistrict: true,
    toAddress: true,
    receiver: true,
    phone: true,
    total: true,
    desc: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    categoryId: true,
    category: { select: { id: true, name: true } },
    userId: true,
    user: true,
    inventoryId: true,
    inventory: {
        select: {
            id: true,
            total: true,
            commodity: true,
            inventoryExtensions: {
                select: { id: true, warehouse: true, total: true, desc: true, status: true },
            },
        },
    },
    warehouseId: true,
})

/** 查询参数 */
function findParams(params?: OrderQuerySchema) {
    return {
        fromProvince: { contains: params?.fromProvince || undefined },
        fromCity: { contains: params?.fromCity || undefined },
        fromDistrict: { contains: params?.fromDistrict || undefined },
        toProvince: { contains: params?.toProvince || undefined },
        toCity: { contains: params?.toCity || undefined },
        toDistrict: { contains: params?.toDistrict || undefined },
        fromAddress: { contains: params?.fromAddress || undefined },
        toAddress: { contains: params?.toAddress || undefined },
        receiver: { contains: params?.receiver || undefined },
        phone: { contains: params?.phone || undefined },
        total: { equals: params?.total },
        desc: { contains: params?.desc || undefined },
        status: { equals: params?.status },
        userId: { equals: params?.userId },
        categoryId: { equals: params?.categoryId },
        inventoryId: { equals: params?.inventoryId },
        warehouseId: { equals: params?.warehouseId },
    } as Prisma.OrderWhereInput
}

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.order, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`订单不存在`)
    }

    return result
}

export class OrderService {
    private prisma = prismaService.prisma

    // 获取订单分页列表
    async findPageAll(params?: OrderQuerySchema) {
        let { currentPage, pageSize } = params ?? {}
        currentPage ??= 1
        pageSize ??= 10
        const skip = (currentPage - 1) * pageSize

        const condition: Prisma.OrderFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where: findParams(params),
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.order.count({ where: findParams(params) }), this.prisma.order.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取订单列表成功')
    }

    // 获取订单列表
    async findAll(params?: OrderQuerySchema) {
        const condition: Prisma.OrderFindManyArgs = {
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.order.findMany(condition)

        return ResponseUtil.success(result, '获取订单列表成功')
    }

    // 通过ID查找订单
    async findById(id: number) {
        const result = await findTarget(this.prisma.order, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取订单详情成功')
    }

    // 创建订单
    async create(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const result = await this.prisma.order.create({ select, data })
            return ResponseUtil.success(result, '创建订单成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该订单已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新订单
    async update(id: number, data: Partial<Order>) {
        await findTarget(this.prisma.order, { where: { id } })

        try {
            const result = await this.prisma.order.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新订单成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`订单ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该订单已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除订单
    async delete(id: number) {
        await findTarget(this.prisma.order, { where: { id } })
        const result = await this.prisma.order.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除订单成功')
    }
}
