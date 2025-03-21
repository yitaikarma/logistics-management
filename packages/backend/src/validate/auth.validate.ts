/*
 * @Author       : Karma
 * @Date         : 2025-03-14 03:00:50
 * @LastEditTime : 2025-03-15 02:39:00
 * @LastEditors  : Karma
 * @Description  : 认证验证
 */

import { z } from '../utils/zod'

// 登录方式 0: 邮箱 1: 用户名 2: 手机号

export const AuthSchema = z.object({
    email: z.string().min(1, { message: '邮箱不能为空' }).email(),
    username: z.string().min(2, { message: '用户名长度不能小于2位' }).max(20, { message: '用户名长度不能大于20位' }),
    phone: z.string().length(11, { message: '手机号长度必须为11位' }).nullish(),
    password: z.string().min(4, { message: '密码长度不能小于4位' }).max(20, { message: '密码长度不能大于20位' }),
})

export const CreateAuthSchema = AuthSchema
export const UpdateAuthSchema = AuthSchema.partial()

export type AuthSchema = z.infer<typeof AuthSchema>

export const AuthQuerySchema = z.object({
    username: z.string().nullish(),
    email: z.string().or(z.string().email()).nullish(),
    phone: z.string().nullish(),
})

export type AuthQuerySchema = z.infer<typeof AuthQuerySchema>

export const AuthBodySchema = z.object({
    username: z.string(),
    email: z.string().or(z.string().email()).nullish(),
    phone: z.string().nullish(),
    password: z.string(),
})

export type AuthBodySchema = z.infer<typeof AuthBodySchema>

// 申请重置密码
export const AuthApplyEmailSchema = z.object({
    email: z.string().or(z.string().email()),
})

export type AuthApplyEmailSchema = z.infer<typeof AuthApplyEmailSchema>

// 重置密码
export const AuthResetPasswordSchema = z.object({
    token: z.string(),
    username: z.string(),
    password: z.string(),
})

export type AuthResetPasswordSchema = z.infer<typeof AuthResetPasswordSchema>
