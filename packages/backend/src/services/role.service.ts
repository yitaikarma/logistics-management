 
/*
 * @Author       : Karma
 * @Date         : 2025-03-14 00:30:11
 * @LastEditTime : 2025-03-15 02:20:29
 * @LastEditors  : Karma
 * @Description  : 权限字典服务
 */

import { Prisma } from '@prisma/client'
import { prismaService } from './prisma.service'
import { NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'

/** 过滤 */
const select = Prisma.validator<Prisma.RoleSelect>()({
    key: true,
    name: true,
})

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.role, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`权限字典不存在`)
    }

    return result
}

export class RoleService {
    private prisma = prismaService.prisma

    // 获取权限字典分页列表
    async findPageAll(currentPage: number = 1, pageSize: number = 10, name?: string) {
        const skip = (currentPage - 1) * pageSize
        const where: Prisma.RoleWhereInput = {
            name: { contains: name ?? '' },
        }
        const condition: Prisma.RoleFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where,
            orderBy: { id: 'asc' },
        }

        const [total, result] = await Promise.all([this.prisma.role.count({ where }), this.prisma.role.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取权限字典列表成功')
    }

    // 获取权限字典列表
    async findAll(name?: string) {
       
        const where: Prisma.RoleWhereInput = {
            name: { contains: name ?? '' },
        }
        const condition: Prisma.RoleFindManyArgs = {
            select,
            where,
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.role.findMany(condition)

        return ResponseUtil.success(result, '获取权限字典列表成功')
    }

    // 通过ID查找权限字典
    async findById(id: number) {
        const result = await findTarget(this.prisma.role, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取权限字典详情成功')
    }
}
