import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'
import { CommodityData } from '../commodity/list'
import { WarehouseData } from '../warehouse/list'

/** 库存记录响应数据类型 */
export interface InventoryRecordData {
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

type InventoryRecordPageParams = InventoryRecordParams & Partial<{ currentPage: number; pageSize: number }>
type InventoryRecordParams = Partial<Omit<InventoryRecordData, 'id'>>
type InventoryRecordBody = Partial<Omit<InventoryRecordData, 'id'>>

export class InventoryRecordService {
  /** 获取库存记录分页列表 */
  static getPage(params?: InventoryRecordPageParams) {
    return request.get<PaginationResult<InventoryRecordData[]>>({ url: '/inventoryRecords/page', params })
  }

  /** 获取库存记录列表 */
  static getList(params?: InventoryRecordParams) {
    return request.get<BaseResult<InventoryRecordData[]>>({ url: '/inventoryRecords', params })
  }

  /** 获取库存记录 */
  static get(id: number) {
    return request.get<BaseResult<InventoryRecordData>>({ url: `/inventoryRecords/${id}` })
  }

  /** 添加库存记录 */
  static add(data: InventoryRecordBody) {
    return request.post<BaseResult<InventoryRecordData>>({ url: '/inventoryRecords', data })
  }

  /** 修改库存记录 */
  static update(id: number, data: InventoryRecordBody) {
    return request.put<BaseResult<InventoryRecordData>>({ url: `/inventoryRecords/${id}`, data })
  }

  /** 删除库存记录 */
  static delete(id: number) {
    return request.del<BaseResult<InventoryRecordData>>({ url: `/inventoryRecords/${id}` })
  }
}
