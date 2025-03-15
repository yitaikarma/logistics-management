/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:33
 * @LastEditTime : 2025-03-13 17:12:28
 * @LastEditors  : Karma
 * @Description  :
 */
import { PrismaClient } from '@prisma/client'
import { pagination } from 'prisma-extension-pagination'
import { logger } from '../utils/logger'

class PrismaService {
    private static instance: PrismaService
    public prisma: PrismaClient

    private constructor() {
        this.prisma = new PrismaClient()
        this.prisma.$extends(pagination())
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
