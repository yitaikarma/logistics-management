import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'

/** 任务分类响应数据类型 */
export interface TaskCategoryData {
  id: number
  name: string
  desc: string
  status: number
  createAt: string
  updateAt: string
}

type TaskCategoryPageParams = TaskCategoryParams & Partial<{ currentPage: number; pageSize: number }>
type TaskCategoryParams = Partial<Omit<TaskCategoryData, 'id'>>
type TaskCategoryBody = Partial<Omit<TaskCategoryData, 'id'>>

export class TaskCategoryService {
  /** 获取任务分类分页列表 */
  static getPage(params?: TaskCategoryPageParams) {
    return request.get<PaginationResult<TaskCategoryData[]>>({ url: '/taskCategories/page', params })
  }

  /** 获取任务分类列表 */
  static getList(params?: TaskCategoryParams) {
    return request.get<BaseResult<TaskCategoryData[]>>({ url: '/taskCategories', params })
  }

  /** 获取任务分类 */
  static get(id: number) {
    return request.get<BaseResult<TaskCategoryData>>({ url: `/taskCategories/${id}` })
  }

  /** 添加任务分类 */
  static add(data: TaskCategoryBody) {
    return request.post<BaseResult<TaskCategoryData>>({ url: '/taskCategories', data })
  }

  /** 修改任务分类 */
  static update(id: number, data: TaskCategoryBody) {
    return request.put<BaseResult<TaskCategoryData>>({ url: `/taskCategories/${id}`, data })
  }

  /** 删除任务分类 */
  static delete(id: number) {
    return request.del<BaseResult<TaskCategoryData>>({ url: `/taskCategories/${id}` })
  }
}
