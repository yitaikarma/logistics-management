/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 车辆分类服务
 */

import { VehicleCategory, Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { VehicleCategoryQuerySchema } from 'src/validate/vehicleCategory.validate'

/** 过滤 */
const select = Prisma.validator<Prisma.VehicleCategorySelect>()({
    id: true,
    name: true,
    desc: true,
    status: true,
    createdAt: true,
    updatedAt: true,
})

/** 查询参数 */
function findParams(params?: VehicleCategoryQuerySchema) {
    return {
        name: { contains: params?.name || undefined },
        desc: { contains: params?.desc || undefined },
        status: { equals: params?.status },
    } as Prisma.VehicleCategoryWhereInput
}

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.vehicleCategory, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`车辆分类不存在`)
    }

    return result
}

export class VehicleCategoryService {
    private prisma = prismaService.prisma

    // 获取车辆分类分页列表
    async findPageAll(params?: VehicleCategoryQuerySchema) {
        let { currentPage, pageSize } = params ?? {}
        currentPage ??= 1
        pageSize ??= 10
        const skip = (currentPage - 1) * pageSize

        const condition: Prisma.VehicleCategoryFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where: findParams(params),
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.vehicleCategory.count({ where: findParams(params) }), this.prisma.vehicleCategory.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取车辆分类列表成功')
    }

    // 获取车辆分类列表
    async findAll(params?: VehicleCategoryQuerySchema) {
        const condition: Prisma.VehicleCategoryFindManyArgs = {
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.vehicleCategory.findMany(condition)

        return ResponseUtil.success(result, '获取车辆分类列表成功')
    }

    // 通过ID查找车辆分类
    async findById(id: number) {
        const result = await findTarget(this.prisma.vehicleCategory, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取车辆分类详情成功')
    }

    // 创建车辆分类
    async create(data: Omit<VehicleCategory, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const result = await this.prisma.vehicleCategory.create({ select, data })
            return ResponseUtil.success(result, '创建车辆分类成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该车辆分类已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新车辆分类
    async update(id: number, data: Partial<VehicleCategory>) {
        await findTarget(this.prisma.vehicleCategory, { where: { id } })

        try {
            const result = await this.prisma.vehicleCategory.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新车辆分类成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`车辆分类ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该车辆分类已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除车辆分类
    async delete(id: number) {
        await findTarget(this.prisma.vehicleCategory, { where: { id } })
        const result = await this.prisma.vehicleCategory.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除车辆分类成功')
    }
}
