import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'

/** 仓库分类响应数据类型 */
export interface WarehouseCategoryData {
  id: number
  name: string
  desc: string
  status: number
  createAt: string
  updateAt: string
}

type WarehouseCategoryPageParams = WarehouseCategoryParams & Partial<{ currentPage: number; pageSize: number }>
type WarehouseCategoryParams = Partial<Omit<WarehouseCategoryData, 'id'>>
type WarehouseCategoryBody = Partial<Omit<WarehouseCategoryData, 'id'>>

export class WarehouseCategoryService {
  /** 获取仓库分类分页列表 */
  static getPage(params?: WarehouseCategoryPageParams) {
    return request.get<PaginationResult<WarehouseCategoryData[]>>({ url: '/warehouseCategories/page', params })
  }

  /** 获取仓库分类列表 */
  static getList(params?: WarehouseCategoryParams) {
    return request.get<BaseResult<WarehouseCategoryData[]>>({ url: '/warehouseCategories', params })
  }

  /** 获取仓库分类 */
  static get(id: number) {
    return request.get<BaseResult<WarehouseCategoryData>>({ url: `/warehouseCategories/${id}` })
  }

  /** 添加仓库分类 */
  static add(data: WarehouseCategoryBody) {
    return request.post<BaseResult<WarehouseCategoryData>>({ url: '/warehouseCategories', data })
  }

  /** 修改仓库分类 */
  static update(id: number, data: WarehouseCategoryBody) {
    return request.put<BaseResult<WarehouseCategoryData>>({ url: `/warehouseCategories/${id}`, data })
  }

  /** 删除仓库分类 */
  static delete(id: number) {
    return request.del<BaseResult<WarehouseCategoryData>>({ url: `/warehouseCategories/${id}` })
  }
}
