import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'
import { VehicleCategoryData } from './category'
import { UserData } from '../user'

/** 车辆响应数据类型 */
export interface VehicleData {
  id: number
  name: string
  categoryId: number
  category: Pick<VehicleCategoryData, 'id' | 'name'>
  userId: number
  user: Pick<UserData, 'id' | 'username'>
  license: string
  desc: string
  status: number
  createAt: string
  updateAt: string
}

type VehiclePageParams = VehicleParams & Partial<{ currentPage: number; pageSize: number }>
type VehicleParams = Partial<Omit<VehicleData, 'id'>>
type VehicleBody = Partial<Omit<VehicleData, 'id'>>

export class VehicleService {
  /** 获取车辆分页列表 */
  static getPage(params?: VehiclePageParams) {
    return request.get<PaginationResult<VehicleData[]>>({ url: '/vehicles/page', params })
  }

  /** 获取车辆列表 */
  static getList(params?: VehicleParams) {
    return request.get<BaseResult<VehicleData[]>>({ url: '/vehicles', params })
  }

  /** 获取车辆 */
  static get(id: number) {
    return request.get<BaseResult<VehicleData>>({ url: `/vehicles/${id}` })
  }

  /** 添加车辆 */
  static add(data: VehicleBody) {
    return request.post<BaseResult<VehicleData>>({ url: '/vehicles', data })
  }

  /** 修改车辆 */
  static update(id: number, data: VehicleBody) {
    return request.put<BaseResult<VehicleData>>({ url: `/vehicles/${id}`, data })
  }

  /** 删除车辆 */
  static delete(id: number) {
    return request.del<BaseResult<VehicleData>>({ url: `/vehicles/${id}` })
  }
}
