/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 仓库服务
 */

import { Warehouse, Prisma } from '@prisma.client'
import { PrismaClientKnownRequestError } from '@prisma.client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { WarehouseQuerySchema } from 'src/validate/warehouse.validate'

/** 过滤 */
const select = Prisma.validator<Prisma.WarehouseSelect>()({
    id: true,
    name: true,
    province: true,
    city: true,
    district: true,
    address: true,
    desc: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    categoryId: true,
    category: { select: { id: true, name: true } },
    userId: true,
    user: { select: { id: true, username: true } },
    username: true,
})

/** 查询参数 */
function findParams(params?: WarehouseQuerySchema) {
    return {
        name: { contains: params?.name || undefined },
        province: { contains: params?.province || undefined },
        city: { contains: params?.city || undefined },
        district: { contains: params?.district || undefined },
        address: { contains: params?.address || undefined },
        desc: { contains: params?.desc || undefined },
        status: { equals: params?.status },
        userId: { equals: params?.userId },
        categoryId: { equals: params?.categoryId },
    } as Prisma.WarehouseWhereInput
}

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.warehouse, condition: any, msg = `仓库不存在`) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(msg)
    }

    return result
}

export class WarehouseService {
    private prisma = prismaService.prisma

    // 获取仓库分页列表
    async findPageAll(params?: WarehouseQuerySchema) {
        let { currentPage, pageSize } = params ?? {}
        currentPage ??= 1
        pageSize ??= 10
        const skip = (currentPage - 1) * pageSize

        const condition: Prisma.WarehouseFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where: findParams(params),
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.warehouse.count({ where: findParams(params) }), this.prisma.warehouse.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取仓库列表成功')
    }

    // 获取仓库列表
    async findAll(params?: WarehouseQuerySchema) {
        const condition: Prisma.WarehouseFindManyArgs = {
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.warehouse.findMany(condition)

        return ResponseUtil.success(result, '获取仓库列表成功')
    }

    // 通过ID查找仓库
    async findById(id: number) {
        const result = await findTarget(this.prisma.warehouse, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取仓库详情成功')
    }

    // 创建仓库
    async create(data: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>) {
        // 查询负责人
        const user = await this.prisma.user.findFirst({ where: { id: data.userId ?? undefined } })
        if (!user) {
            throw new NotFoundError(`用户ID ${data.userId} 不存在`)
        }
        data.username = user.username

        try {
            const result = await this.prisma.warehouse.create({ select, data })
            return ResponseUtil.success(result, '创建仓库成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该仓库已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新仓库
    async update(id: number, data: Partial<Warehouse>) {
        await findTarget(this.prisma.warehouse, { where: { id } })

        // 查询负责人
        const user = await this.prisma.user.findFirst({ where: { id: data.userId ?? undefined } })
        if (!user) {
            throw new NotFoundError(`用户ID ${data.userId} 不存在`)
        }
        data.username = user.username

        try {
            const result = await this.prisma.warehouse.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新仓库成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`仓库ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该仓库已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除仓库
    async delete(id: number) {
        await findTarget(this.prisma.warehouse, { where: { id } })
        const result = await this.prisma.warehouse.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除仓库成功')
    }
}
