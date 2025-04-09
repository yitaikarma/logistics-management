import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'
import { CommodityCategoryData } from './category'

/** 商品响应数据类型 */
export interface CommodityData {
  id: number
  name: string
  categoryId: number
  category: Pick<CommodityCategoryData, 'id' | 'name'>
  price: number
  desc: string
  status: number
  createAt: string
  updateAt: string
}

type CommodityPageParams = CommodityParams & Partial<{ currentPage: number; pageSize: number }>
type CommodityParams = Partial<Omit<CommodityData, 'id'>>
type CommodityBody = Partial<Omit<CommodityData, 'id'>>

export class CommodityService {
  /** 获取商品分页列表 */
  static getPage(params?: CommodityPageParams) {
    return request.get<PaginationResult<CommodityData[]>>({ url: '/commodities/page', params })
  }

  /** 获取商品列表 */
  static getList(params?: CommodityParams) {
    return request.get<BaseResult<CommodityData[]>>({ url: '/commodities', params })
  }

  /** 获取商品 */
  static get(id: number) {
    return request.get<BaseResult<CommodityData>>({ url: `/commodities/${id}` })
  }

  /** 添加商品 */
  static add(data: CommodityBody) {
    return request.post<BaseResult<CommodityData>>({ url: '/commodities', data })
  }

  /** 修改商品 */
  static update(id: number, data: CommodityBody) {
    return request.put<BaseResult<CommodityData>>({ url: `/commodities/${id}`, data })
  }

  /** 删除商品 */
  static delete(id: number) {
    return request.del<BaseResult<CommodityData>>({ url: `/commodities/${id}` })
  }
}
