import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'

/** 配送分类响应数据类型 */
export interface DistributionCategoryData {
  id: number
  name: string
  desc: string
  status: number
  createAt: string
  updateAt: string
}

type DistributionCategoryPageParams = DistributionCategoryParams & Partial<{ currentPage: number; pageSize: number }>
type DistributionCategoryParams = Partial<Omit<DistributionCategoryData, 'id'>>
type DistributionCategoryBody = Partial<Omit<DistributionCategoryData, 'id'>>

export class DistributionCategoryService {
  /** 获取配送分类分页列表 */
  static getPage(params?: DistributionCategoryPageParams) {
    return request.get<PaginationResult<DistributionCategoryData[]>>({ url: '/distributionCategories/page', params })
  }

  /** 获取配送分类列表 */
  static getList(params?: DistributionCategoryParams) {
    return request.get<BaseResult<DistributionCategoryData[]>>({ url: '/distributionCategories', params })
  }

  /** 获取配送分类 */
  static get(id: number) {
    return request.get<BaseResult<DistributionCategoryData>>({ url: `/distributionCategories/${id}` })
  }

  /** 添加配送分类 */
  static add(data: DistributionCategoryBody) {
    return request.post<BaseResult<DistributionCategoryData>>({ url: '/distributionCategories', data })
  }

  /** 修改配送分类 */
  static update(id: number, data: DistributionCategoryBody) {
    return request.put<BaseResult<DistributionCategoryData>>({ url: `/distributionCategories/${id}`, data })
  }

  /** 删除配送分类 */
  static delete(id: number) {
    return request.del<BaseResult<DistributionCategoryData>>({ url: `/distributionCategories/${id}` })
  }
}
