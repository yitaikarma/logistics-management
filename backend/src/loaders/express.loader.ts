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
import { errorHandlerMiddleware } from '../middlewares/error.middleware'

const corsOptions = {
    origin: ['http://8.222.203.222:9095', /lm_admin\.finalvk\.com$/], // Replace with your frontend origin
    credentials: true, // Allow credentials
    allowedHeaders: ['Content-Type', 'Authorization'], // Include necessary headers
}

export function expressLoader(): Application {
    const app = express()

    // 中间件配置
    app.use(cors(corsOptions)) // 跨域中间件
    app.use(helmet()) // 安全中间件
    app.use(express.json()) // 解析 application/json
    app.use(express.urlencoded({ extended: true })) // 解析 application/x-www-form-urlencoded
    app.use(morgan('dev')) // 日志中间件

    // // 应用响应处理中间件（在路由之前）

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
        // console.log(req)

        ResponseUtil.error(res, 404, '未找到路由')
    })

    return app
}
