import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'
import { RoleData } from '../role/role'

/** 用户响应数据类型 */
export interface UserData {
  id: number
  nickname: string
  username: string
  email: string
  role: number
  roleId: number
  roleObj: RoleData
  gender: number
  phone?: string
  avatar?: string
  address?: string
  desc?: string
}

type UserPageParams = UserParams & Partial<{ currentPage: number; pageSize: number }>
type UserParams = Partial<Omit<UserData, 'id' | 'avatar'>>
type UserBody = Partial<Omit<UserData, 'id'>>

export class UserService {
  /** 获取用户分页列表 */
  static getPage(params?: UserPageParams) {
    return request.get<PaginationResult<UserData[]>>({ url: '/users/page', params })
  }

  /** 获取用户列表 */
  static getList(params?: UserParams) {
    return request.get<BaseResult<UserData[]>>({ url: '/users', params })
  }

  /** 获取用户 */
  static get(id: number) {
    return request.get<BaseResult<UserData>>({ url: `/users/${id}` })
  }

  /** 添加用户 */
  static add(data: UserBody) {
    return request.post<BaseResult<UserData>>({ url: '/users', data })
  }

  /** 修改用户 */
  static update(id: number, data: UserBody) {
    return request.put<BaseResult<UserData>>({ url: `/users/${id}`, data })
  }

  /** 删除用户 */
  static delete(id: number) {
    return request.del<BaseResult<UserData>>({ url: `/users/${id}` })
  }
}
