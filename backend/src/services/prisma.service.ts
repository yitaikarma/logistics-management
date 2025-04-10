/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:33
 * @LastEditTime : 2025-03-13 17:12:28
 * @LastEditors  : Karma
 * @Description  :
 */
import { PrismaClient } from '@prisma.client'
import { pagination } from 'prisma-extension-pagination'
import { logger } from '../utils/logger'
import dayjs from 'dayjs'

// 处理查询结果中的日期
const formatResult = (data: any) => {
    if (!data) return data

    Object.keys(data).forEach(key => {
        if (data[key] instanceof Date) {
            data[key] = dayjs(data[key]).format('YYYY-MM-DD HH:mm:ss')
        }
    })

    return data
}

class PrismaService {
    private static instance: PrismaService
    public prisma: PrismaClient

    private constructor() {
        this.prisma = new PrismaClient()
        this.prisma.$extends(pagination())

        // 全局中间件处理时间格式
        this.prisma.$use(async (params, next) => {
            const result = await next(params)

            // 处理数组结果
            if (Array.isArray(result)) {
                return result.map(item => formatResult(item))
            }

            // 处理单个对象
            return formatResult(result)
        })
    }

    public static getInstance(): PrismaService {
        if (!PrismaService.instance) {
            PrismaService.instance = new PrismaService()
        }

        return PrismaService.instance
    }

    public async connect(): Promise<void> {
        try {
            await this.prisma.$connect()
            logger.info('Database connection established')
        } catch (error) {
            logger.error('Unable to connect to the database:', error)
            process.exit(1)
        }
    }

    public async disconnect(): Promise<void> {
        await this.prisma.$disconnect()
        logger.info('Database connection closed')
    }
}

export const prismaService = PrismaService.getInstance()
