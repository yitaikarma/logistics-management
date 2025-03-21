/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 库存服务
 */

import { Inventory, Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { InventoryQuerySchema } from '../validate/inventory.validate'

/** 过滤 */
const select = Prisma.validator<Prisma.InventorySelect>()({
    id: true,
    total: true,
    desc: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    commodityId: true,
    commodity: { select: { id: true, name: true, price: true } },
    warehouseId: true,
    warehouse: { select: { id: true, name: true } },
})

/** 查询参数 */
function findParams(params?: InventoryQuerySchema) {
    return {
        total: { equals: params?.total },
        status: { equals: params?.status },
        commodityId: { equals: params?.commodityId },
        warehouseId: { equals: params?.warehouseId },
    } as Prisma.InventoryWhereInput
}

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.inventory, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`库存不存在`)
    }

    return result
}

export class InventoryService {
    private prisma = prismaService.prisma

    // 获取库存分页列表
    async findPageAll(params?: InventoryQuerySchema) {
        let { currentPage, pageSize } = params ?? {}
        currentPage ??= 1
        pageSize ??= 10
        const skip = (currentPage - 1) * pageSize

        const condition: Prisma.InventoryFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where: findParams(params),
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.inventory.count({ where: findParams(params) }), this.prisma.inventory.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取库存列表成功')
    }

    // 获取库存列表
    async findAll(params?: InventoryQuerySchema) {
        console.log('params', findParams(params))
        const condition: Prisma.InventoryFindManyArgs = {
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.inventory.findMany(condition)

        return ResponseUtil.success(result, '获取库存列表成功')
    }

    // 通过ID查找库存
    async findById(id: number) {
        const result = await findTarget(this.prisma.inventory, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取库存详情成功')
    }

    // 创建库存
    async create(data: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'> & { type: number }) {
        try {
            const searchResult = await this.prisma.inventory.findFirst({ where: { commodityId: data?.commodityId, warehouseId: data?.warehouseId } })

            let result: Inventory | null = null
            if (!searchResult) {
                result = await this.prisma.inventory.create({
                    select,
                    data: {
                        total: data.total,
                        desc: data.desc,
                        status: data.status,
                        commodityId: data.commodityId,
                        warehouseId: data.warehouseId,
                    },
                })
            } else {
                result = await this.prisma.inventory.update({
                    where: { id: searchResult.id },
                    select,
                    data: {
                        total: data.type === 1 ? { increment: data.total } : data.type === 2 ? { decrement: data.total } : data.total,
                    },
                })
            }

            await this.prisma.inventoryRecord.create({
                data: {
                    type: data.type,
                    total: data.total,
                    desc: data.desc,
                    status: data.status,
                    commodityId: data.commodityId,
                    warehouseId: data.warehouseId,
                },
            })

            return ResponseUtil.success(result, '创建库存成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该库存已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新库存
    async update(id: number, data: Partial<Inventory>) {
        await findTarget(this.prisma.inventory, { where: { id } })

        try {
            const result = await this.prisma.inventory.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新库存成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`库存ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该库存已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除库存
    async delete(id: number) {
        await findTarget(this.prisma.inventory, { where: { id } })
        const result = await this.prisma.inventory.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除库存成功')
    }
}
