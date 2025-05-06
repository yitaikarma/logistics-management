import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'
import { CommodityData } from '../commodity/list'
import { UserData } from '../user'
import { OrderCategoryData } from './category'
import { InventoryData } from '../inventory/list'

/** 订单响应数据类型 */
export interface OrderData {
  id: number
  fromProvince: string
  fromCity: string
  fromDistrict: string
  toProvince: string
  toCity: string
  toDistrict: string
  fromAddress: string
  toAddress: string
  receiver: string
  phone: string
  total: number
  desc: string
  status: number
  createAt: string
  updateAt: string
  categoryId: number
  category: Pick<OrderCategoryData, 'id' | 'name'>
  userId: number
  user: Pick<UserData, 'id' | 'username' | 'phone'>
  commodityId: number
  commodity: Pick<CommodityData, 'id' | 'name'>
  inventoryId: number
  inventory: InventoryData
}

type OrderPageParams = OrderParams & Partial<{ currentPage: number; pageSize: number }>
type OrderParams = Partial<Omit<OrderData, 'id'>>
type OrderBody = Partial<Omit<OrderData, 'id'>>

export class OrderService {
  /** 获取订单分页列表 */
  static getPage(params?: OrderPageParams) {
    return request.get<PaginationResult<OrderData[]>>({ url: '/orders/page', params })
  }

  /** 获取订单列表 */
  static getList(params?: OrderParams) {
    return request.get<BaseResult<OrderData[]>>({ url: '/orders', params })
  }

  /** 获取订单 */
  static get(id: number) {
    return request.get<BaseResult<OrderData>>({ url: `/orders/${id}` })
  }

  /** 添加订单 */
  static add(data: OrderBody) {
    return request.post<BaseResult<OrderData>>({ url: '/orders', data })
  }

  /** 修改订单 */
  static update(id: number, data: OrderBody) {
    return request.put<BaseResult<OrderData>>({ url: `/orders/${id}`, data })
  }

  /** 删除订单 */
  static delete(id: number) {
    return request.del<BaseResult<OrderData>>({ url: `/orders/${id}` })
  }
}
