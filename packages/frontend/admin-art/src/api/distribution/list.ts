import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'
import { DistributionCategoryData } from './category'

/** 配送响应数据类型 */
export interface DistributionData {
  id: number
  desc: string
  status: number
  createAt: string
  updateAt: string
  categoryId: number
  category: Pick<DistributionCategoryData, 'id' | 'name'>
}

type DistributionPageParams = DistributionParams & Partial<{ currentPage: number; pageSize: number }>
type DistributionParams = Partial<Omit<DistributionData, 'id'>>
type DistributionBody = Partial<Omit<DistributionData, 'id'>>

export class DistributionService {
  /** 获取配送分页列表 */
  static getPage(params?: DistributionPageParams) {
    return request.get<PaginationResult<DistributionData[]>>({ url: '/distributions/page', params })
  }

  /** 获取配送列表 */
  static getList(params?: DistributionParams) {
    return request.get<BaseResult<DistributionData[]>>({ url: '/distributions', params })
  }

  /** 获取配送 */
  static get(id: number) {
    return request.get<BaseResult<DistributionData>>({ url: `/distributions/${id}` })
  }

  /** 添加配送 */
  static add(data: DistributionBody) {
    return request.post<BaseResult<DistributionData>>({ url: '/distributions', data })
  }

  /** 修改配送 */
  static update(id: number, data: DistributionBody) {
    return request.put<BaseResult<DistributionData>>({ url: `/distributions/${id}`, data })
  }

  /** 删除配送 */
  static delete(id: number) {
    return request.del<BaseResult<DistributionData>>({ url: `/distributions/${id}` })
  }
}
