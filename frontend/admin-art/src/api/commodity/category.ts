import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'

/** 商品分类响应数据类型 */
export interface CommodityCategoryData {
  id: number
  name: string
  desc: string
  status: number
  createAt: string
  updateAt: string
}

type CommodityCategoryPageParams = CommodityCategoryParams & Partial<{ currentPage: number; pageSize: number }>
type CommodityCategoryParams = Partial<Omit<CommodityCategoryData, 'id'>>
type CommodityCategoryBody = Partial<Omit<CommodityCategoryData, 'id'>>

export class CommodityCategoryService {
  /** 获取商品分类分页列表 */
  static getPage(params?: CommodityCategoryPageParams) {
    return request.get<PaginationResult<CommodityCategoryData[]>>({ url: '/commodityCategories/page', params })
  }

  /** 获取商品分类列表 */
  static getList(params?: CommodityCategoryParams) {
    return request.get<BaseResult<CommodityCategoryData[]>>({ url: '/commodityCategories', params })
  }

  /** 获取商品分类 */
  static get(id: number) {
    return request.get<BaseResult<CommodityCategoryData>>({ url: `/commodityCategories/${id}` })
  }

  /** 添加商品分类 */
  static add(data: CommodityCategoryBody) {
    return request.post<BaseResult<CommodityCategoryData>>({ url: '/commodityCategories', data })
  }

  /** 修改商品分类 */
  static update(id: number, data: CommodityCategoryBody) {
    return request.put<BaseResult<CommodityCategoryData>>({ url: `/commodityCategories/${id}`, data })
  }

  /** 删除商品分类 */
  static delete(id: number) {
    return request.del<BaseResult<CommodityCategoryData>>({ url: `/commodityCategories/${id}` })
  }
}
