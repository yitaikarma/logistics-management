/*
 * @Author       : Karma
 * @Date         : 2025-03-14 03:31:58
 * @LastEditTime : 2025-03-14 03:53:44
 * @LastEditors  : Karma
 * @Description  :
 */

// /// <reference types="vite/client" />

// declare module '*.vue' {
//     import type { DefineComponent } from 'vue'

//     const component: DefineComponent<object, object, any>
//     export default component
// }

declare global {
    import type { StringValue } from 'ms'

    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test'
            PORT: string
            DATABASE_URL: string
            // JWT_SECRET: any
            // JWT_EXPIRES_IN: StringValue
            REDIS_URL?: string
        }
    }
}

// 这个导出是必须的，否则这个文件会被视为一个模块而不是全局声明
export {}
