/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 车辆服务
 */

import { Vehicle, Prisma } from '@prisma.client'
import { PrismaClientKnownRequestError } from '@prisma.client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { VehicleQuerySchema } from 'src/validate/vehicle.validate'

/** 过滤 */
const select = Prisma.validator<Prisma.VehicleSelect>()({
    id: true,
    name: true,
    license: true,
    desc: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    categoryId: true,
    category: { select: { id: true, name: true } },
    userId: true,
    username: true,
    user: { select: { id: true, username: true } },
})

/** 查询参数 */
function findParams(params?: VehicleQuerySchema) {
    return {
        name: { contains: params?.name || undefined },
        license: { contains: params?.license || undefined },
        status: { equals: params?.status },
        categoryId: { equals: params?.categoryId },
        userId: { equals: params?.userId },
    } as Prisma.VehicleWhereInput
}

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.vehicle, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`车辆不存在`)
    }

    return result
}

export class VehicleService {
    private prisma = prismaService.prisma

    // 获取车辆分页列表
    async findPageAll(params?: VehicleQuerySchema) {
        let { currentPage, pageSize } = params ?? {}
        currentPage ??= 1
        pageSize ??= 10
        const skip = (currentPage - 1) * pageSize

        const condition: Prisma.VehicleFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where: findParams(params),
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.vehicle.count({ where: findParams(params) }), this.prisma.vehicle.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取车辆列表成功')
    }

    // 获取车辆列表
    async findAll(params?: VehicleQuerySchema) {
        const condition: Prisma.VehicleFindManyArgs = {
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.vehicle.findMany(condition)

        return ResponseUtil.success(result, '获取车辆列表成功')
    }

    // 通过ID查找车辆
    async findById(id: number) {
        const result = await findTarget(this.prisma.vehicle, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取车辆详情成功')
    }

    // 创建车辆
    async create(data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) {
        // 查询负责人
        const user = await this.prisma.user.findFirst({ where: { id: data.userId ?? undefined } })
        if (!user) {
            throw new NotFoundError(`用户ID ${data.userId} 不存在`)
        }
        data.username = user.username

        try {
            const result = await this.prisma.vehicle.create({ select, data })
            return ResponseUtil.success(result, '创建车辆成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该车辆已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新车辆
    async update(id: number, data: Partial<Vehicle>) {
        await findTarget(this.prisma.vehicle, { where: { id } })

        // 查询负责人
        const user = await this.prisma.user.findFirst({ where: { id: data.userId ?? undefined } })
        if (!user) {
            throw new NotFoundError(`用户ID ${data.userId} 不存在`)
        }
        data.username = user.username

        try {
            const result = await this.prisma.vehicle.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新车辆成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`车辆ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该车辆已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除车辆
    async delete(id: number) {
        await findTarget(this.prisma.vehicle, { where: { id } })
        const result = await this.prisma.vehicle.delete({ where: { id }, select })
        return ResponseUtil.success(result, '删除车辆成功')
    }
}
