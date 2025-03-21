import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'
import { UserData } from '../user'
import { WarehouseCategoryData } from './category'

/** 仓库响应数据类型 */
export interface WarehouseData {
  id: number
  name: string
  categoryId: number
  category: Pick<WarehouseCategoryData, 'id' | 'name'>
  userId: number
  user: Pick<UserData, 'id' | 'username'>
  desc: string
  status: number
  createAt: string
  updateAt: string
}

type WarehousePageParams = WarehouseParams & Partial<{ currentPage: number; pageSize: number }>
type WarehouseParams = Partial<Omit<WarehouseData, 'id'>>
type WarehouseBody = Partial<Omit<WarehouseData, 'id'>>

export class WarehouseService {
  /** 获取仓库分页列表 */
  static getPage(params?: WarehousePageParams) {
    return request.get<PaginationResult<WarehouseData[]>>({ url: '/warehouses/page', params })
  }

  /** 获取仓库列表 */
  static getList(params?: WarehouseParams) {
    return request.get<BaseResult<WarehouseData[]>>({ url: '/warehouses', params })
  }

  /** 获取仓库 */
  static get(id: number) {
    return request.get<BaseResult<WarehouseData>>({ url: `/warehouses/${id}` })
  }

  /** 添加仓库 */
  static add(data: WarehouseBody) {
    return request.post<BaseResult<WarehouseData>>({ url: '/warehouses', data })
  }

  /** 修改仓库 */
  static update(id: number, data: WarehouseBody) {
    return request.put<BaseResult<WarehouseData>>({ url: `/warehouses/${id}`, data })
  }

  /** 删除仓库 */
  static delete(id: number) {
    return request.del<BaseResult<WarehouseData>>({ url: `/warehouses/${id}` })
  }
}
