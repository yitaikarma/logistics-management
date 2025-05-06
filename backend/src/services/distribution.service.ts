/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 配送服务
 */

import { Distribution, Prisma } from '@prisma.client'
import { PrismaClientKnownRequestError } from '@prisma.client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { DistributionQuerySchema } from 'src/validate/distribution.validate'

/** 过滤 */
const select = Prisma.validator<Prisma.DistributionSelect>()({
    id: true,
    desc: true,
    startTime: true,
    endTime: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    orderId: true,
    order: {
        include: {
            inventory: {
                include: {
                    commodity: true,
                    inventoryExtensions: {
                        include: {
                            warehouse: true,
                        },
                    },
                },
            },
            user: true,
            category: { select: { id: true, name: true } },
        },
    },
})

/** 查询参数 */
function findParams(params?: DistributionQuerySchema) {
    return {
        desc: { contains: params?.desc || undefined },
        status: { equals: params?.status },
    } as Prisma.DistributionWhereInput
}

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.distribution, condition: any, msg = `配送不存在`) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(msg)
    }

    return result
}

export class DistributionService {
    private prisma = prismaService.prisma

    // 获取配送分页列表
    async findPageAll(params?: DistributionQuerySchema, type: 'default' | 'completed' = 'default') {
        let { currentPage, pageSize } = params ?? {}
        currentPage ??= 1
        pageSize ??= 10
        const skip = (currentPage - 1) * pageSize

        let where: Prisma.DistributionWhereInput
        if (type === 'completed') {
            where = {
                OR: [{ status: 3 }, { status: 4 }],
            }
        } else {
            where = {
                ...findParams(params),
            }
        }

        const condition: Prisma.DistributionFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where,
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.distribution.count({ where: findParams(params) }), this.prisma.distribution.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取配送列表成功')
    }

    // 获取配送列表
    async findAll(params?: DistributionQuerySchema) {
        const condition: Prisma.DistributionFindManyArgs = {
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.distribution.findMany(condition)

        return ResponseUtil.success(result, '获取配送列表成功')
    }

    // 通过ID查找配送
    async findById(id: number) {
        const result = await findTarget(this.prisma.distribution, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取配送详情成功')
    }

    // 创建配送
    async create(data: Omit<Distribution, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const result = await this.prisma.distribution.create({ select, data })
            return ResponseUtil.success(result, '创建配送成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该配送已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新配送
    async update(id: number, data: Partial<Distribution>) {
        await findTarget(this.prisma.distribution, { where: { id } })

        try {
            const result = await this.prisma.distribution.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新配送成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`配送ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该配送已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除配送
    async delete(id: number) {
        await findTarget(this.prisma.distribution, { where: { id } })
        const result = await this.prisma.distribution.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除配送成功')
    }
}
