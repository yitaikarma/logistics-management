import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'
import { TaskCategoryData } from './category'
import { UserData } from '../user'

/** 任务响应数据类型 */
export interface TaskData {
  id: number
  name: string
  desc: string
  startTime: string
  endTime: string
  status: number
  createAt: string
  updateAt: string
  categoryId: number
  category: Pick<TaskCategoryData, 'id' | 'name'>
  userId: number
  user: Pick<UserData, 'id' | 'username'>
}

type TaskPageParams = TaskParams & Partial<{ currentPage: number; pageSize: number }>
type TaskParams = Partial<Omit<TaskData, 'id'>>
type TaskBody = Partial<Omit<TaskData, 'id'>>

export class TaskService {
  /** 获取任务分页列表 */
  static getPage(params?: TaskPageParams) {
    return request.get<PaginationResult<TaskData[]>>({ url: '/tasks/page', params })
  }

  /** 获取任务列表 */
  static getList(params?: TaskParams) {
    return request.get<BaseResult<TaskData[]>>({ url: '/tasks', params })
  }

  /** 获取任务 */
  static get(id: number) {
    return request.get<BaseResult<TaskData>>({ url: `/tasks/${id}` })
  }

  /** 添加任务 */
  static add(data: TaskBody) {
    return request.post<BaseResult<TaskData>>({ url: '/tasks', data })
  }

  /** 修改任务 */
  static update(id: number, data: TaskBody) {
    return request.put<BaseResult<TaskData>>({ url: `/tasks/${id}`, data })
  }

  /** 删除任务 */
  static delete(id: number) {
    return request.del<BaseResult<TaskData>>({ url: `/tasks/${id}` })
  }
}
