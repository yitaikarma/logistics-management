// 路由别名
export enum RoutesAlias {
  Home = '/index/index', // 首页
  Login = '/login', // 登录
  Register = '/register', // 注册
  ForgetPassword = '/forget-password', // 忘记密码
  Exception403 = '/exception/403', // 403
  Exception404 = '/exception/404', // 404
  Exception500 = '/exception/500', // 500
  // 确定的路由
  CommodityList = '/commodity/List', // 商品列表
  CommodityCategory = '/commodity/Category', // 商品分类

  WarehouseList = '/warehouse/List', // 仓库列表
  WarehouseCategory = '/warehouse/Category', // 仓库分类

  InventoryList = '/inventory/List', // 库存
  InventoryEntryRecord = '/inventory/EntryRecord', // 入库
  InventoryOutRecord = '/inventory/OutRecord', // 出库

  VehicleList = '/vehicle/List', // 车辆列表
  VehicleCategory = '/vehicle/Category', // 车辆分类

  OrderApplication = '/order/Application', // 订单申请
  OrderList = '/order/List', // 订单列表
  OrderCategory = '/order/Category', //
  OrderRecords = '/order/Records', // 订单记录

  TaskRelease = '/task/Release', // 任务发布
  TaskList = '/task/List', // 任务列表
  TaskCategory = '/task/Category', // 任务分类
  TaskRecords = '/task/Records', // 任务记录

  DistributionList = '/distribution/List', // 配送列表
  DistributionCategory = '/distribution/Category', // 仪表盘分类
  DistributionSignedList = '/distribution/SignedList', // 配送签收列表
  DistributionRecords = '/distribution/Records', // 配送记录
  DistributionExceptionRecords = '/distribution/ExceptionRecords', // 配送异常记录

  Success = '/result/Success', // 成功
  Fail = '/result/Fail', // 失败
  Dashboard = '/dashboard/console', // 工作台
  Analysis = '/dashboard/analysis', // 分析页
  Ecommerce = '/dashboard/ecommerce', // 电子商务
  IconList = '/widgets/IconList', // 图标列表
  IconSelector = '/widgets/IconSelector', // 图标选择器
  ImageCrop = '/widgets/ImageCrop', // 图片裁剪
  Excel = '/widgets/Excel', // Excel
  Video = '/widgets/Video', // 视频
  CountTo = '/widgets/CountTo', // 计数
  WangEditor = '/widgets/WangEditor', // 富文本编辑器
  Watermark = '/widgets/Watermark', // 水印
  ContextMenu = '/widgets/ContextMenu', // 上下文菜单
  Qrcode = '/widgets/Qrcode', // 二维码
  Drag = '/widgets/Drag', // 拖拽
  TextScroll = '/widgets/TextScroll', // 文字滚动
  Fireworks = '/widgets/Fireworks', // 礼花效果
  Chat = '/template/Chat', // 聊天
  Cards = '/template/Cards', // 卡片
  Banners = '/template/Banners', // 横幅
  Charts = '/template/Charts', // 图表
  Map = '/template/Map', // 地图
  Calendar = '/template/Calendar', // 日历
  Pricing = '/template/Pricing', // 定价
  ArticleList = '/article/ArticleList', // 文章列表
  ArticleDetail = '/article/ArticleDetail', // 文章详情
  Comment = '/article/Comment', // 评论
  ArticlePublish = '/article/ArticlePublish', // 文章发布
  Account = '/user/Account', // 账户
  Department = '/user/Department', // 部门
  Role = '/user/Role', // 角色
  UserCenter = '/user/User', // 用户中心
  Menu = '/menu/Menu', // 菜单
  Permission = '/menu/Permission', // 权限
  NestedMenu1 = '/menu/nested/Menu1', // 嵌套菜单1
  NestedMenu21 = '/menu/nested/menu2/Menu2-1', // 嵌套菜单2-1
  NestedMenu31 = '/menu/nested/menu3/Menu3-1', // 嵌套菜单3-1
  NestedMenu321 = '/menu/nested/menu3/menu3-2/Menu3-2-1', // 嵌套菜单3-2-1
  Setting = '/system/Setting', // 设置
  Api = '/system/Api', // API
  Log = '/system/Log', // 日志
  Server = '/safeguard/Server', // 服务器
  ChangeLog = '/log/ChangeLog' // 更新日志
}
