/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:56:56
 * @LastEditTime : 2025-03-12 18:19:36
 * @LastEditors  : Karma
 * @Description  :
 */
import 'reflect-metadata'

export enum ParamType {
    BODY = 'body',
    QUERY = 'query',
    PARAM = 'params',
    HEADERS = 'headers',
    REQUEST = 'request',
    RESPONSE = 'response',
}

export const PARAM_METADATA = 'param:metadata'

export interface ParamDefinition {
    index: number
    type: ParamType
    name?: string
}

function createParamDecorator(type: ParamType) {
    return (name?: string): ParameterDecorator => {
        return (target, propertyKey, index) => {
            const metadataKey = `${PARAM_METADATA}:${String(propertyKey)}`

            if (!Reflect.hasMetadata(metadataKey, target.constructor)) {
                Reflect.defineMetadata(metadataKey, [], target.constructor)
            }

            const params = Reflect.getMetadata(metadataKey, target.constructor) as ParamDefinition[]

            params.push({ index, type, name })

            Reflect.defineMetadata(metadataKey, params, target.constructor)
        }
    }
}

export const Body = createParamDecorator(ParamType.BODY)
export const Query = createParamDecorator(ParamType.QUERY)
export const Param = createParamDecorator(ParamType.PARAM)
export const Headers = createParamDecorator(ParamType.HEADERS)
export const Req = createParamDecorator(ParamType.REQUEST)
export const Res = createParamDecorator(ParamType.RESPONSE)
