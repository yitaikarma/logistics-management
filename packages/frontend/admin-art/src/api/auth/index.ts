import request from '@/utils/http'
import { BaseResult } from '@/types/axios'
import { UserData } from '../'

export type CheckRepeatParams = Omit<SignupBody, 'password'>

export type SignupBody = {
  username?: string
  email?: string
  phone?: string
  password: string
}

export type SigninBody = SignupBody

type Result = { user: UserData; token: string }

export class AuthService {
  /** 账号重复检查 */
  static checkRepeat(params: CheckRepeatParams) {
    return request.get<BaseResult>({ url: '/auth/checkRepeat', params })
  }

  /** 用户注册 */
  static signup(data: SignupBody) {
    return request.post<BaseResult<Result>>({ url: '/auth/signup', data })
  }

  /** 用户登录 */
  static signin(data: SigninBody) {
    return request.post<BaseResult<Result>>({ url: '/auth/signin', data })
  }

  /** 申请重置密码 */
  static applyResetPassword(data: { email: string }) {
    return request.post<BaseResult>({ url: '/auth/applyResetPassword', data })
  }

  /** 修改密码 */
  static resetPassword(data: { username: string; token: string; password: string }) {
    return request.post<BaseResult>({ url: '/auth/resetPassword', data })
  }

  /** 用户登出 */
  static signout() {
    return request.get<BaseResult>({ url: '/auth/signout' })
  }
}
