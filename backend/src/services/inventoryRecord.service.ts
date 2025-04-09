/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 库存记录服务
 */

import { InventoryRecord, Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { InventoryRecordQuerySchema } from '../validate/inventoryRecord.validate'

/** 过滤 */
const select = Prisma.validator<Prisma.InventoryRecordSelect>()({
    id: true,
    type: true,
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
function findParams(params?: InventoryRecordQuerySchema) {
    return {
        type: { equals: params?.type },
        total: { equals: params?.total },
        status: { equals: params?.status },
        commodityId: { equals: params?.commodityId },
        warehouseId: { equals: params?.warehouseId },
    } as Prisma.InventoryRecordWhereInput
}

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.inventoryRecord, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`库存记录不存在`)
    }

    return result
}

export class InventoryRecordService {
    private prisma = prismaService.prisma

    // 获取库存记录分页列表
    async findPageAll(params?: InventoryRecordQuerySchema) {
        let { currentPage, pageSize } = params ?? {}
        currentPage ??= 1
        pageSize ??= 10
        const skip = (currentPage - 1) * pageSize

        const condition: Prisma.InventoryRecordFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where: findParams(params),
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.inventoryRecord.count({ where: findParams(params) }), this.prisma.inventoryRecord.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取库存记录列表成功')
    }

    // 获取库存记录列表
    async findAll(params?: InventoryRecordQuerySchema) {
        console.log('params', findParams(params))
        const condition: Prisma.InventoryRecordFindManyArgs = {
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.inventoryRecord.findMany(condition)

        return ResponseUtil.success(result, '获取库存记录列表成功')
    }

    // 通过ID查找库存记录
    async findById(id: number) {
        const result = await findTarget(this.prisma.inventoryRecord, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取库存记录详情成功')
    }

    // 创建库存记录
    async create(data: Omit<InventoryRecord, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const result = await this.prisma.inventoryRecord.create({ select, data })
            return ResponseUtil.success(result, '创建库存记录成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该库存记录已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新库存记录
    async update(id: number, data: Partial<InventoryRecord>) {
        await findTarget(this.prisma.inventoryRecord, { where: { id } })

        try {
            const result = await this.prisma.inventoryRecord.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新库存记录成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`库存记录ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该库存记录已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除库存记录
    async delete(id: number) {
        await findTarget(this.prisma.inventoryRecord, { where: { id } })
        const result = await this.prisma.inventoryRecord.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除库存记录成功')
    }
}
