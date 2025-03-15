/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:57:29
 * @LastEditTime : 2025-03-15 02:23:42
 * @LastEditors  : Karma
 * @Description  :
 */
import { Application, Request, Response, NextFunction, RequestHandler } from 'express'
import { CONTROLLER_METADATA, ROUTES_METADATA, RouteDefinition } from '../decorators/controller.decorator'
import { MIDDLEWARE_METADATA } from '../decorators/middleware.decorator'
import { PARAM_METADATA, ParamDefinition, ParamType } from '../decorators/param.decorator'

export function controllerLoader(app: Application): void {
    const controllers = getControllers()

    controllers.forEach(ControllerClass => {
        const controllerInstance = new ControllerClass()
        const controllerMetadata = Reflect.getMetadata(CONTROLLER_METADATA, ControllerClass)
        const routes = (Reflect.getMetadata(ROUTES_METADATA, ControllerClass) as RouteDefinition[]) || []
        const controllerMiddleware = (Reflect.getMetadata(MIDDLEWARE_METADATA, ControllerClass) as RequestHandler[]) || []

        routes.forEach(route => {
            const { path, method, methodName, middleware } = route

            // 组合路径
            const fullPath = `${controllerMetadata.path}${path}`

            // 方法级中间件
            const methodMiddleware = (Reflect.getMetadata(`${MIDDLEWARE_METADATA}:${methodName}`, ControllerClass) as RequestHandler[]) || []

            // 组合所有中间件
            const handlers = [...controllerMiddleware, ...methodMiddleware, ...middleware]

            // 参数装饰器处理
            const paramDecorators = (Reflect.getMetadata(`${PARAM_METADATA}:${methodName}`, ControllerClass) as ParamDefinition[]) || []

            // 注册路由
            ;(app as any)[method](fullPath, ...handlers, async (req: Request, res: Response, next: NextFunction) => {
                try {
                    // 解析参数
                    const args = extractParameters(req, res, next, paramDecorators)

                    // 调用控制器方法
                    const result = await controllerInstance[methodName](...args)

                    // 如果结果没有被响应(例如，当使用了@Res()装饰器时)，则自动响应
                    if (result !== undefined && !res.headersSent) {
                        res.json(result)
                    }
                } catch (error) {
                    next(error)
                }
            })

            console.log(`Registered route: [${method.toUpperCase()}] ${fullPath}`)
        })
    })
}

// 提取所有参数
function extractParameters(req: Request, res: Response, next: NextFunction, params: ParamDefinition[]): any[] {
    const args: any[] = []
    console.log(req.body)

    // 对参数进行排序
    const sortedParams = [...params].sort((a, b) => a.index - b.index)

    // 为每个参数索引分配正确的值
    sortedParams.forEach(param => {
        switch (param.type) {
            case ParamType.BODY:
                args[param.index] = param.name ? req.body[param.name] : req.body
                break
            case ParamType.QUERY:
                args[param.index] = param.name ? req.query[param.name] : req.query
                break
            case ParamType.PARAM:
                args[param.index] = param.name ? req.params[param.name] : req.params
                break
            case ParamType.HEADERS:
                args[param.index] = param.name ? req.headers[param.name] : req.headers
                break
            case ParamType.REQUEST:
                args[param.index] = req
                break
            case ParamType.RESPONSE:
                args[param.index] = res
                break
            default:
                args[param.index] = undefined
        }
    })

    return args
}

// 获取所有控制器类
function getControllers(): any[] {
    // 这里需要手动导入所有控制器，或者使用其他方法自动获取所有控制器
    // 此处示例使用硬编码的方式，实际项目中可能需要更灵活的方案
    const { RoleController } = require('../controllers/role.controller')
    const { AuthController } = require('../controllers/auth.controller')
    const { UserController } = require('../controllers/user.controller')
    const { CommodityController } = require('../controllers/commodity.controller')
    const { CompanyController } = require('../controllers/company.controller')
    const { EmployeeController } = require('../controllers/employee.controller')
    const { WarehouseController } = require('../controllers/warehouse.controller')
    const { SaleController } = require('../controllers/sale.controller')

    return [AuthController, UserController, RoleController, CommodityController, CompanyController, EmployeeController, WarehouseController, SaleController]
}
