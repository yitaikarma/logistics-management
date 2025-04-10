/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 配送分类服务
 */

import { DistributionCategory, Prisma } from '@prisma.client'
import { PrismaClientKnownRequestError } from '@prisma.client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { DistributionCategoryQuerySchema } from 'src/validate/distributionCategory.validate'

/** 过滤 */
const select = Prisma.validator<Prisma.DistributionCategorySelect>()({
    id: true,
    name: true,
    desc: true,
    status: true,
    createdAt: true,
    updatedAt: true,
})

/** 查询参数 */
function findParams(params?: DistributionCategoryQuerySchema) {
    return {
        name: { contains: params?.name || undefined },
        desc: { contains: params?.desc || undefined },
        status: { equals: params?.status },
    } as Prisma.DistributionCategoryWhereInput
}

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.distributionCategory, condition: any, msg = `配送分类不存在`) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(msg)
    }

    return result
}

export class DistributionCategoryService {
    private prisma = prismaService.prisma

    // 获取配送分类分页列表
    async findPageAll(params?: DistributionCategoryQuerySchema) {
        let { currentPage, pageSize } = params ?? {}
        currentPage ??= 1
        pageSize ??= 10
        const skip = (currentPage - 1) * pageSize

        const condition: Prisma.DistributionCategoryFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where: findParams(params),
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.distributionCategory.count({ where: findParams(params) }), this.prisma.distributionCategory.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取配送分类列表成功')
    }

    // 获取配送分类列表
    async findAll(params?: DistributionCategoryQuerySchema) {
        const condition: Prisma.DistributionCategoryFindManyArgs = {
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.distributionCategory.findMany(condition)

        return ResponseUtil.success(result, '获取配送分类列表成功')
    }

    // 通过ID查找配送分类
    async findById(id: number) {
        const result = await findTarget(this.prisma.distributionCategory, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取配送分类详情成功')
    }

    // 创建配送分类
    async create(data: Omit<DistributionCategory, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const result = await this.prisma.distributionCategory.create({ select, data })
            return ResponseUtil.success(result, '创建配送分类成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该配送分类已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新配送分类
    async update(id: number, data: Partial<DistributionCategory>) {
        await findTarget(this.prisma.distributionCategory, { where: { id } })

        try {
            const result = await this.prisma.distributionCategory.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新配送分类成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`配送分类ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该配送分类已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除配送分类
    async delete(id: number) {
        await findTarget(this.prisma.distributionCategory, { where: { id } })
        const result = await this.prisma.distributionCategory.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除配送分类成功')
    }
}
