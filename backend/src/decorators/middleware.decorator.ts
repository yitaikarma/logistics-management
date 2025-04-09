/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:56:46
 * @LastEditTime : 2025-03-12 14:51:47
 * @LastEditors  : Karma
 * @Description  :
 */
import 'reflect-metadata'
import { RequestHandler } from 'express'

export const MIDDLEWARE_METADATA = 'middleware:metadata'

export function UseMiddleware(...middleware: RequestHandler[]): MethodDecorator & ClassDecorator {
    return (target: any, propertyKey?: string | symbol) => {
        if (propertyKey) {
            // 方法装饰器
            const metadataKey = `${MIDDLEWARE_METADATA}:${String(propertyKey)}`
            if (!Reflect.hasMetadata(metadataKey, target.constructor)) {
                Reflect.defineMetadata(metadataKey, [], target.constructor)
            }

            const middlewares = Reflect.getMetadata(metadataKey, target.constructor) as RequestHandler[]
            Reflect.defineMetadata(metadataKey, [...middlewares, ...middleware], target.constructor)
        } else {
            // 类装饰器
            if (!Reflect.hasMetadata(MIDDLEWARE_METADATA, target)) {
                Reflect.defineMetadata(MIDDLEWARE_METADATA, [], target)
            }

            const middlewares = Reflect.getMetadata(MIDDLEWARE_METADATA, target) as RequestHandler[]
            Reflect.defineMetadata(MIDDLEWARE_METADATA, [...middlewares, ...middleware], target)
        }
    }
}
