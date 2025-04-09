/*
 * @Author       : Karma
 * @Date         : 2025-03-12 16:44:46
 * @LastEditTime : 2025-03-14 21:28:42
 * @LastEditors  : Karma
 * @Description  : 错误处理类
 */

export enum ErrorCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500,
}

/** 自定义错误类  */
export class AppError extends Error {
    public readonly code: number
    public readonly data?: string[]

    constructor(message: string, code: number = ErrorCode.INTERNAL_ERROR, detail?: string | string[]) {
        super(message)
        this.name = this.constructor.name
        this.code = code
        if (detail) {
            this.data = Array.isArray(detail) ? detail : [detail]
        }
        Error.captureStackTrace(this, this.constructor)
    }
}

/** 400 Bad Request */
export class BadRequestError extends AppError {
    constructor(message: string = '请求参数错误', data: any = null) {
        super(message, ErrorCode.BAD_REQUEST, data)
        this.name = this.constructor.name
    }
}

/** 401 Unauthorized */
export class UnauthorizedError extends AppError {
    constructor(message: string = '未授权访问', data: any = null) {
        super(message, ErrorCode.UNAUTHORIZED, data)
        this.name = this.constructor.name
    }
}

/** 404 Not Found */
export class NotFoundError extends AppError {
    constructor(message: string = '资源未找到', data: any = null) {
        super(message, ErrorCode.NOT_FOUND, data)
        this.name = this.constructor.name
    }
}
