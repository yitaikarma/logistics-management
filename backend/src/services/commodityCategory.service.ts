/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 商品分类服务
 */

import { CommodityCategory, Prisma } from '@prisma.client'
import { PrismaClientKnownRequestError } from '@prisma.client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { CommodityCategoryQuerySchema } from 'src/validate/commodityCategory.validate'

/** 过滤 */
const select = Prisma.validator<Prisma.CommodityCategorySelect>()({
    id: true,
    name: true,
    desc: true,
    status: true,
    createdAt: true,
    updatedAt: true,
})

/** 查询参数 */
function findParams(params?: CommodityCategoryQuerySchema) {
    return {
        name: { contains: params?.name || undefined },
        desc: { contains: params?.desc || undefined },
        status: { equals: params?.status },
    } as Prisma.CommodityCategoryWhereInput
}

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.commodityCategory, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`商品分类不存在`)
    }

    return result
}

export class CommodityCategoryService {
    private prisma = prismaService.prisma

    // 获取商品分类分页列表
    async findPageAll(params?: CommodityCategoryQuerySchema) {
        let { currentPage, pageSize } = params ?? {}
        currentPage ??= 1
        pageSize ??= 10
        const skip = (currentPage - 1) * pageSize

        const condition: Prisma.CommodityCategoryFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where: findParams(params),
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.commodityCategory.count({ where: findParams(params) }), this.prisma.commodityCategory.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取商品分类列表成功')
    }

    // 获取商品分类列表
    async findAll(params?: CommodityCategoryQuerySchema) {
        console.log('params', findParams(params))

        const condition: Prisma.CommodityCategoryFindManyArgs = {
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.commodityCategory.findMany(condition)

        return ResponseUtil.success(result, '获取商品分类列表成功')
    }

    // 通过ID查找商品分类
    async findById(id: number) {
        const result = await findTarget(this.prisma.commodityCategory, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取商品分类详情成功')
    }

    // 创建商品分类
    async create(data: Omit<CommodityCategory, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const result = await this.prisma.commodityCategory.create({ select, data })
            return ResponseUtil.success(result, '创建商品分类成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该商品分类已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新商品分类
    async update(id: number, data: Partial<CommodityCategory>) {
        await findTarget(this.prisma.commodityCategory, { where: { id } })

        try {
            const result = await this.prisma.commodityCategory.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新商品分类成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`商品分类ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该商品分类已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除商品分类
    async delete(id: number) {
        await findTarget(this.prisma.commodityCategory, { where: { id } })
        const result = await this.prisma.commodityCategory.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除商品分类成功')
    }
}
