import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'

/** 权限响应数据类型 */
export interface RoleData {
  id: number
  name: string
  value: number
  status: number
  desc: string
  createAt: string
  updateAt: string
}

type RolePageParams = RoleParams & Partial<{ currentPage: number; pageSize: number }>
type RoleParams = Partial<Omit<RoleData, 'id'>>
type RoleBody = Partial<Omit<RoleData, 'id'>>

export class RoleService {
  /** 获取权限分页列表 */
  static getPage(params?: RolePageParams) {
    return request.get<PaginationResult<RoleData[]>>({ url: '/roles/page', params })
  }

  /** 获取权限列表 */
  static getList(params?: RoleParams) {
    return request.get<BaseResult<RoleData[]>>({ url: '/roles', params })
  }

  /** 获取权限 */
  static get(id: number) {
    return request.get<BaseResult<RoleData>>({ url: `/roles/${id}` })
  }

  /** 添加权限 */
  static add(data: RoleBody) {
    return request.post<BaseResult<RoleData>>({ url: '/roles', data })
  }

  /** 修改权限 */
  static update(id: number, data: RoleBody) {
    return request.put<BaseResult<RoleData>>({ url: `/roles/${id}`, data })
  }

  /** 删除权限 */
  static delete(id: number) {
    return request.del<BaseResult<RoleData>>({ url: `/roles/${id}` })
  }
}
