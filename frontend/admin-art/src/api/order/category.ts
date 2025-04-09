import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'

/** 订单分类响应数据类型 */
export interface OrderCategoryData {
  id: number
  name: string
  desc: string
  status: number
  createAt: string
  updateAt: string
}

type OrderCategoryPageParams = OrderCategoryParams & Partial<{ currentPage: number; pageSize: number }>
type OrderCategoryParams = Partial<Omit<OrderCategoryData, 'id'>>
type OrderCategoryBody = Partial<Omit<OrderCategoryData, 'id'>>

export class OrderCategoryService {
  /** 获取订单分类分页列表 */
  static getPage(params?: OrderCategoryPageParams) {
    return request.get<PaginationResult<OrderCategoryData[]>>({ url: '/orderCategories/page', params })
  }

  /** 获取订单分类列表 */
  static getList(params?: OrderCategoryParams) {
    return request.get<BaseResult<OrderCategoryData[]>>({ url: '/orderCategories', params })
  }

  /** 获取订单分类 */
  static get(id: number) {
    return request.get<BaseResult<OrderCategoryData>>({ url: `/orderCategories/${id}` })
  }

  /** 添加订单分类 */
  static add(data: OrderCategoryBody) {
    return request.post<BaseResult<OrderCategoryData>>({ url: '/orderCategories', data })
  }

  /** 修改订单分类 */
  static update(id: number, data: OrderCategoryBody) {
    return request.put<BaseResult<OrderCategoryData>>({ url: `/orderCategories/${id}`, data })
  }

  /** 删除订单分类 */
  static delete(id: number) {
    return request.del<BaseResult<OrderCategoryData>>({ url: `/orderCategories/${id}` })
  }
}
