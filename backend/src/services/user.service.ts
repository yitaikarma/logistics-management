/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:09
 * @LastEditTime : 2025-03-15 02:36:24
 * @LastEditors  : Karma
 * @Description  : 用户服务
 */

import { User, Prisma } from '@prisma.client'
import { PrismaClientKnownRequestError } from '@prisma.client/runtime/library'
import bcrypt from 'bcryptjs'
import { prismaService } from './prisma.service'
import { AppError, ErrorCode, NotFoundError } from '../utils/errors'
import { ResponseUtil } from '../utils/response'
import { UserQuerySchema } from 'src/validate/user.validate'

/** 过滤 */
const select = Prisma.validator<Prisma.UserSelect>()({
    id: true,
    email: true,
    username: true,
    phone: true,
    password: false,
    nickname: true,
    role: true,
    gender: true,
    avatar: true,
    address: true,
    desc: true,
    status: true,
    createdAt: true,
    updatedAt: true,
})

/** 查询参数 */
function findParams(params?: UserQuerySchema) {
    return {
        nickname: { contains: params?.nickname || undefined },
        username: { contains: params?.username || undefined },
        email: { contains: params?.email || undefined },
        phone: { contains: params?.phone || undefined },
        gender: { equals: params?.gender },
        role: { equals: params?.role },
        status: { equals: params?.status },
    } as Prisma.UserWhereInput
}

/** 查询 */
async function findTarget(model: typeof prismaService.prisma.user, condition: any) {
    const result = await model.findUnique(condition)

    if (!result) {
        throw new NotFoundError(`用户不存在`)
    }

    return result
}

export class UserService {
    private prisma = prismaService.prisma

    // 获取用户分页列表
    async findPageAll(params?: UserQuerySchema) {
        let { currentPage, pageSize } = params ?? {}
        currentPage ??= 1
        pageSize ??= 10
        const skip = (currentPage - 1) * pageSize

        console.log('params', params, findParams(params))

        const condition: Prisma.UserFindManyArgs = {
            skip,
            take: pageSize,
            select,
            where: findParams(params),
            orderBy: { createdAt: 'desc' },
        }

        const [total, result] = await Promise.all([this.prisma.user.count({ where: findParams(params) }), this.prisma.user.findMany(condition)])

        return ResponseUtil.page(result, total, currentPage, pageSize, '获取用户列表成功')
    }

    // 获取用户列表
    async findAll(params?: UserQuerySchema) {
        const condition: Prisma.UserFindManyArgs = {
            select,
            where: findParams(params),
            orderBy: { id: 'asc' },
        }

        const result = await this.prisma.user.findMany(condition)

        return ResponseUtil.success(result, '获取用户列表成功')
    }

    // 通过ID查找用户
    async findById(id: number) {
        const result = await findTarget(this.prisma.user, {
            where: { id },
            select,
        })

        return ResponseUtil.success(result, '获取用户详情成功')
    }

    // 通过电子邮件查找用户
    async findByEmail(email: string) {
        const result = await findTarget(this.prisma.user, {
            where: { email },
            select,
        })

        return ResponseUtil.success(result, '获取用户详情成功')
    }

    // 创建用户
    async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
        //  对密码进行哈希处理
        data.password = bcrypt.hashSync(data.password!, 10)

        try {
            const result = await this.prisma.user.create({ select, data })
            return ResponseUtil.success(result, '创建用户成功', 201)
        } catch (error) {
            // 特定错误处理，如邮箱唯一性冲突
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                // @ts-expect-error metadataKey
                throw new AppError('字段内容重复', ErrorCode.BAD_REQUEST, [error.meta ?? error])
            }
            throw error
        }
    }

    // 更新用户
    async update(id: number, data: Partial<User>) {
        //  对密码进行哈希处理
        if (data.password) {
            data.password = bcrypt.hashSync(data.password, 10)
        }

        await findTarget(this.prisma.user, { where: { id } })

        try {
            const result = await this.prisma.user.update({
                where: { id },
                select,
                data,
            })

            return ResponseUtil.success(result, '更新用户成功')
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundError(`用户ID ${id} 不存在`)
                }
                if (error.code === 'P2002') {
                    throw new AppError('该邮箱已被其他用户使用', ErrorCode.BAD_REQUEST)
                }
            }
            throw error
        }
    }

    // 删除用户
    async delete(id: number) {
        await findTarget(this.prisma.user, { where: { id } })
        const result = await this.prisma.user.delete({
            where: { id },
            select,
        })
        return ResponseUtil.success(result, '删除用户成功')
    }
}
