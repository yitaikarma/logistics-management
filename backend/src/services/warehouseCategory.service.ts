/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 仓库分类服务
 */

import { WarehouseCategory, Prisma } from '@prisma.client'
import { PrismaClientKnownRequestError } from '@prisma.client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { WarehouseCategoryQuerySchema } from 'src/validate/warehouseCategory.validate'

/** 过滤 */
const select = Prisma.validator<Prisma.WarehouseCategorySelect>()({
    id: true,
    name: true,
    desc: true,
    status: true,
    createdAt: true,
    updatedAt: true,
})

/** 查询参数 */
function findParams(params?: WarehouseCategoryQuerySchema) {
    return {
        name: { contains: params?.name || undefined },
        desc: { contains: params?.desc || undefined },
        status: { equals: params?.status },
    } as Prisma.WarehouseCategoryWhereInput
}

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.warehouseCategory, condition: any, msg = `仓库分类不存在`) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(msg)
    }

    return result
}

export class WarehouseCategoryService {
    private prisma = prismaService.prisma

    // 获取仓库分类分页列表
    async findPageAll(params?: WarehouseCategoryQuerySchema) {
        let { currentPage, pageSize } = params ?? {}
        currentPage ??= 1
        pageSize ??= 10
        const skip = (currentPage - 1) * pageSize

        const condition: Prisma.WarehouseCategoryFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where: findParams(params),
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.warehouseCategory.count({ where: findParams(params) }), this.prisma.warehouseCategory.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取仓库分类列表成功')
    }

    // 获取仓库分类列表
    async findAll(params?: WarehouseCategoryQuerySchema) {
        const condition: Prisma.WarehouseCategoryFindManyArgs = {
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.warehouseCategory.findMany(condition)

        return ResponseUtil.success(result, '获取仓库分类列表成功')
    }

    // 通过ID查找仓库分类
    async findById(id: number) {
        const result = await findTarget(this.prisma.warehouseCategory, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取仓库分类详情成功')
    }

    // 创建仓库分类
    async create(data: Omit<WarehouseCategory, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const result = await this.prisma.warehouseCategory.create({ select, data })
            return ResponseUtil.success(result, '创建仓库分类成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该仓库分类已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新仓库分类
    async update(id: number, data: Partial<WarehouseCategory>) {
        await findTarget(this.prisma.warehouseCategory, { where: { id } })

        try {
            const result = await this.prisma.warehouseCategory.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新仓库分类成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`仓库分类ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该仓库分类已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除仓库分类
    async delete(id: number) {
        await findTarget(this.prisma.warehouseCategory, { where: { id } })
        const result = await this.prisma.warehouseCategory.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除仓库分类成功')
    }
}
