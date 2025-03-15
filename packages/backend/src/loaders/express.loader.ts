/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:00
 * @LastEditTime : 2025-03-13 16:50:17
 * @LastEditors  : Karma
 * @Description  :
 */
import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { controllerLoader } from './controller.loader'
import { ResponseUtil } from '../utils/response'
import { logger } from '../utils/logger'
import { responseHandler } from '../middlewares/responseHandler'
import { errorHandlerMiddleware } from '../middlewares/error.middleware'

export function expressLoader(): Application {
    const app = express()

    // 中间件配置
    app.use(cors())
    app.use(helmet())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(morgan('dev'))

    // // 应用响应处理中间件（在路由之前）
    // app.use(responseHandler)

    // 健康检查端点
    app.get('/health', (req, res) => {
        res.status(200).json(ResponseUtil.success('ok', '服务正常'))
    })

    // 加载控制器
    controllerLoader(app)

    // 错误处理中间件（在所有路由之后）
    app.use(errorHandlerMiddleware)

    // 404路由处理
    app.use((req: Request, res: Response) => {
        ResponseUtil.error(res, 404, '未找到路由')
    })

    return app
}
