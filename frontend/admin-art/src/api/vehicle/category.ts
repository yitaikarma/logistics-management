import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'

/** 车辆分类响应数据类型 */
export interface VehicleCategoryData {
  id: number
  name: string
  desc: string
  status: number
  createAt: string
  updateAt: string
}

type VehicleCategoryPageParams = VehicleCategoryParams & Partial<{ currentPage: number; pageSize: number }>
type VehicleCategoryParams = Partial<Omit<VehicleCategoryData, 'id'>>
type VehicleCategoryBody = Partial<Omit<VehicleCategoryData, 'id'>>

export class VehicleCategoryService {
  /** 获取车辆分类分页列表 */
  static getPage(params?: VehicleCategoryPageParams) {
    return request.get<PaginationResult<VehicleCategoryData[]>>({ url: '/vehicleCategories/page', params })
  }

  /** 获取车辆分类列表 */
  static getList(params?: VehicleCategoryParams) {
    return request.get<BaseResult<VehicleCategoryData[]>>({ url: '/vehicleCategories', params })
  }

  /** 获取车辆分类 */
  static get(id: number) {
    return request.get<BaseResult<VehicleCategoryData>>({ url: `/vehicleCategories/${id}` })
  }

  /** 添加车辆分类 */
  static add(data: VehicleCategoryBody) {
    return request.post<BaseResult<VehicleCategoryData>>({ url: '/vehicleCategories', data })
  }

  /** 修改车辆分类 */
  static update(id: number, data: VehicleCategoryBody) {
    return request.put<BaseResult<VehicleCategoryData>>({ url: `/vehicleCategories/${id}`, data })
  }

  /** 删除车辆分类 */
  static delete(id: number) {
    return request.del<BaseResult<VehicleCategoryData>>({ url: `/vehicleCategories/${id}` })
  }
}
