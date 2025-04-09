/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:56:38
 * @LastEditTime : 2025-03-12 14:51:43
 * @LastEditors  : Karma
 * @Description  :
 */
import 'reflect-metadata'

export const CONTROLLER_METADATA = 'controller:metadata'
export const ROUTES_METADATA = 'routes:metadata'

export interface ControllerOptions {
    path: string
}

export interface RouteDefinition {
    path: string
    method: string
    methodName: string
    middleware: any[]
}

export function Controller(options: ControllerOptions): ClassDecorator {
    return target => {
        Reflect.defineMetadata(CONTROLLER_METADATA, options, target)
    }
}

export function createRouteDecorator(method: string) {
    return (path: string = '', ...middleware: any[]): MethodDecorator => {
        return (target, propertyKey) => {
            if (!Reflect.hasMetadata(ROUTES_METADATA, target.constructor)) {
                Reflect.defineMetadata(ROUTES_METADATA, [], target.constructor)
            }

            const routes = Reflect.getMetadata(ROUTES_METADATA, target.constructor) as RouteDefinition[]
            routes.push({
                method,
                path,
                methodName: propertyKey as string,
                middleware,
            })

            Reflect.defineMetadata(ROUTES_METADATA, routes, target.constructor)
        }
    }
}

export const Get = createRouteDecorator('get')
export const Post = createRouteDecorator('post')
export const Put = createRouteDecorator('put')
export const Delete = createRouteDecorator('delete')
export const Patch = createRouteDecorator('patch')
