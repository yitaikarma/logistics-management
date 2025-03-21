/*
 * @Author       : Karma
 * @Date         : 2025-03-12 17:38:56
 * @LastEditTime : 2025-03-12 22:50:39
 * @LastEditors  : Karma
 * @Description  :
 */

import { Response } from 'express'
export interface ApiResponse<T> {
    code: number
    message: string
    data: T | null
    errors?: string[]
    timestamp: number
    success: boolean
}

export class ResponseUtil {
    /**
     * 成功响应
     * @param data 响应数据
     * @param message 响应消息
     * @param code 状态码
     */
    static success<T>(data: T, message = '操作成功', code = 200) {
        return {
            code,
            message,
            data,
            success: true,
            timestamp: Date.now(),
        }
    }

    /**
     * 失败响应
     * @param res 响应对象
     * @param message 错误消息
     * @param code 错误码
     * @param errors 错误详情
     */
    static error(res: Response, code = 500, message = '请求错误', errors: string[] = []) {
        res.status(code).json({
            code,
            message,
            errors,
            success: false,
            timestamp: Date.now(),
        })
    }

    /**
     * 分页数据响应
     * @param records 数据列表
     * @param total 总数
     * @param currentPage 当前页
     * @param pageSize 每页数量
     * @param message 响应消息
     */
    static page<T>(records: T[], total: number, currentPage: number, pageSize: number, message = '查询成功') {
        return this.success({ records, total, currentPage, pageSize }, message)
    }
}
