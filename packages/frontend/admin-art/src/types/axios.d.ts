export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined

/** 请求配置 */
export interface RequestOptions {
  joinParamsToUrl?: boolean
  formatDate?: boolean
  isTransformResponse?: boolean
  isReturnNativeResponse?: boolean
  joinPrefix?: boolean
  apiUrl?: string
  errorMessageMode?: ErrorMessageMode
  joinTime?: boolean
  ignoreCancelToken?: boolean
  withToken?: boolean
}

/** 基础接口返回的数据结构 */
export interface BaseResult<T = any> {
  code: number // 状态码
  success: boolean // 是否成功
  message: string // 消息
  timestamp: number // 时间戳
  token?: string // 可选字段，用于返回 token
  data: T // 数据
  errors?: string[] // 错误信息
}

/** 分页数据结构 */
export interface PaginationData<T> {
  currentPage: number // 当前页
  pageSize: number // 每页条数
  // lastPage: number // 总页数
  total: number // 总条数
  records: T[] // 数据列表
}

/** 分页接口返回的数据结构 */
export type PaginationResult<T> = BaseResult<PaginationData<T>>
