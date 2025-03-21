/*
 * @Author       : Karma
 * @Date         : 2025-03-14 00:30:11
 * @LastEditTime : 2025-03-15 02:20:29
 * @LastEditors  : Karma
 * @Description  : 权限服务
 */

import { Prisma, Role } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { RoleQuerySchema } from 'src/validate/role.validate'

/** 过滤 */
const select = Prisma.validator<Prisma.RoleSelect>()({
    id: true,
    name: true,
    value: true,
    desc: true,
    status: true,
    createdAt: true,
    updatedAt: true,
})

/** 查询参数 */
function findParams(params?: RoleQuerySchema) {
    return {
        name: { contains: params?.name || undefined },
        value: { contains: params?.value },
        desc: { contains: params?.desc || undefined },
        status: { equals: params?.status },
    } as Prisma.RoleWhereInput
}

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.role, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`权限不存在`)
    }

    return result
}

export class RoleService {
    private prisma = prismaService.prisma

    // 获取权限分页列表
    async findPageAll(params?: RoleQuerySchema) {
        let { currentPage, pageSize } = params ?? {}
        currentPage ??= 1
        pageSize ??= 10
        const skip = (currentPage - 1) * pageSize

        const condition: Prisma.RoleFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const [total, result] = await Promise.all([this.prisma.role.count({ where: findParams(params) }), this.prisma.role.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取权限列表成功')
    }

    // 获取权限列表
    async findAll(params?: RoleQuerySchema) {
        const condition: Prisma.RoleFindManyArgs = {
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.role.findMany(condition)

        return ResponseUtil.success(result, '获取权限列表成功')
    }

    // 通过ID查找权限
    async findById(id: number) {
        const result = await findTarget(this.prisma.role, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取权限详情成功')
    }

    // 创建权限
    async create(data: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const result = await this.prisma.role.create({ select, data })
            return ResponseUtil.success(result, '创建权限成功', 201)
        } catch (error) {
            // 特定错误处理，如某字段唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new AppError('该权限已存在', ErrorCode.BAD_REQUEST)
            }
            throw error
        }
    }

    // 更新权限
    async update(id: number, data: Partial<Role>) {
        await findTarget(this.prisma.role, { where: { id } })

        try {
            const result = await this.prisma.role.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新权限成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`权限ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该权限已存在', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除权限
    async delete(id: number) {
        const result = await this.prisma.role.delete({
            where: { id },
        })

        return ResponseUtil.success(result, '删除权限成功')
    }
}
