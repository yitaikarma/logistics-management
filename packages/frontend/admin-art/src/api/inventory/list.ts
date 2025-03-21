import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'
import { CommodityData } from '../commodity/list'
import { WarehouseData } from '../warehouse/list'

/** 库存响应数据类型 */
export interface InventoryData {
  id: number
  type: number
  total: number
  commodityId: number
  commodity: Pick<CommodityData, 'id' | 'name' | 'price'>
  warehouseId: number
  warehouse: Pick<WarehouseData, 'id' | 'name'>
  desc: string
  status: number
  createAt: string
  updateAt: string
}

type InventoryPageParams = InventoryParams & Partial<{ currentPage: number; pageSize: number }>
type InventoryParams = Partial<Omit<InventoryData, 'id'>>
type InventoryBody = Partial<Omit<InventoryData, 'id'>>

export class InventoryService {
  /** 获取库存分页列表 */
  static getPage(params?: InventoryPageParams) {
    return request.get<PaginationResult<InventoryData[]>>({ url: '/inventories/page', params })
  }

  /** 获取库存列表 */
  static getList(params?: InventoryParams) {
    return request.get<BaseResult<InventoryData[]>>({ url: '/inventories', params })
  }

  /** 获取库存 */
  static get(id: number) {
    return request.get<BaseResult<InventoryData>>({ url: `/inventories/${id}` })
  }

  /** 添加库存 */
  static add(data: InventoryBody) {
    return request.post<BaseResult<InventoryData>>({ url: '/inventories', data })
  }

  /** 修改库存 */
  static update(id: number, data: InventoryBody) {
    return request.put<BaseResult<InventoryData>>({ url: `/inventories/${id}`, data })
  }

  /** 删除库存 */
  static delete(id: number) {
    return request.del<BaseResult<InventoryData>>({ url: `/inventories/${id}` })
  }
}
