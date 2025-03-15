/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:58:35
 * @LastEditTime : 2025-03-13 16:50:00
 * @LastEditors  : Karma
 * @Description  :
 */
import 'reflect-metadata'
import dotenv from 'dotenv'
import { expressLoader } from './loaders/express.loader'
import { prismaService } from './services/prisma.service'
import { logger } from './utils/logger'

// 加载环境变量
dotenv.config()

async function startServer() {
    const PORT = process.env.PORT || 3000

    // 初始化数据库连接
    await prismaService.connect()

    // 创建Express应用
    const app = expressLoader()

    // 启动服务器
    app.listen(PORT, () => {
        logger.info(`环境: ${process.env.NODE_ENV}`)
        logger.info(`服务已启动，监听端口: ${PORT}`)
        logger.info(`Server is running on http://localhost:${PORT}`)
    })

    // 优雅关闭
    const gracefulShutdown = async () => {
        logger.info('Shutting down server...')
        await prismaService.disconnect()
        process.exit(0)
    }

    // 处理进程退出信号
    process.on('SIGTERM', gracefulShutdown)
    process.on('SIGINT', gracefulShutdown)
}

startServer().catch(error => {
    logger.error('Failed to start server:', error)
    process.exit(1)
})
