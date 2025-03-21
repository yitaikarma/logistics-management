import { upgradeLogList } from '@/mock/upgradeLog'
import { RoutesAlias } from './routesAlias'
import { MenuListType } from '@/types/menu'

/**
 * 菜单列表、异步路由
 *
 * 支持两种模式:
 * 1. 前端静态配置 - 直接使用本文件中定义的路由配置
 * 2. 后端动态配置 - 后端返回菜单数据，前端解析生成路由
 *
 * 菜单标题（title）:
 * 可以是 i18n 的 key，也可以是字符串，比如：'用户列表'
 */
export const asyncRoutes: MenuListType[] = [
  // 工作台
  {
    id: 1,
    name: 'Dashboard',
    path: '/dashboard',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.dashboard.title',
      icon: '&#xe721;',
      keepAlive: false
    },
    children: [
      {
        id: 101,
        path: 'console',
        name: 'Console',
        component: RoutesAlias.Dashboard,
        meta: {
          title: 'menus.dashboard.console',
          keepAlive: true
        }
      },
      {
        id: 102,
        path: 'analysis',
        name: 'Analysis',
        component: RoutesAlias.Analysis,
        meta: {
          title: 'menus.dashboard.analysis',
          keepAlive: true
        }
      },
      {
        id: 103,
        path: 'ecommerce',
        name: 'Ecommerce',
        component: RoutesAlias.Ecommerce,
        meta: {
          title: 'menus.dashboard.ecommerce',
          keepAlive: true,
          showTextBadge: 'new'
        }
      }
    ]
  },
  // 系统管理
  {
    id: 9,
    path: '/system',
    name: 'System',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.system.title',
      icon: '&#xe7b9;',
      keepAlive: false
    },
    children: [
      {
        id: 901,
        path: 'setting',
        name: 'Setting',
        component: RoutesAlias.Setting,
        meta: {
          title: 'menus.system.setting',
          keepAlive: true
        }
      },
      {
        id: 902,
        path: 'api',
        name: 'Api',
        component: RoutesAlias.Api,
        meta: {
          title: 'menus.system.api',
          keepAlive: true
        }
      },
      {
        id: 903,
        path: 'log',
        name: 'Log',
        component: RoutesAlias.Log,
        meta: {
          title: 'menus.system.log',
          keepAlive: true
        }
      }
    ]
  },
  // 用户管理
  {
    id: 2,
    name: 'User',
    path: '/user',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.user.title',
      icon: '&#xe86e;',
      keepAlive: false
    },
    children: [
      {
        id: 301,
        path: 'account',
        name: 'Account',
        component: RoutesAlias.Account,
        meta: {
          title: 'menus.user.account',
          keepAlive: true
        }
      },
      // {
      //   id: 302,
      //   path: 'department',
      //   name: 'Department',
      //   component: RoutesAlias.Department,
      //   meta: {
      //     title: 'menus.user.department',
      //     keepAlive: false
      //   }
      // },
      {
        id: 303,
        path: 'role',
        name: 'Role',
        component: RoutesAlias.Role,
        meta: {
          title: 'menus.user.role',
          keepAlive: true
        }
      },
      {
        id: 304,
        path: 'user',
        name: 'UserCenter',
        component: RoutesAlias.UserCenter,
        meta: {
          title: 'menus.user.userCenter',
          isHide: true,
          keepAlive: true,
          isHideTab: true
        }
      }
    ]
  },
  // 商品管理
  {
    id: 100,
    path: '/commodity',
    name: 'Commodity',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.commodity.title',
      icon: '&#xe77f;',
      keepAlive: false
    },
    children: [
      {
        id: 10001,
        path: 'list',
        name: 'CommodityList',
        component: RoutesAlias.CommodityList,
        meta: {
          title: 'menus.commodity.list',
          keepAlive: true
        }
      },
      {
        id: 10002,
        path: 'category',
        name: 'CommodityCategory',
        component: RoutesAlias.CommodityCategory,
        meta: {
          title: 'menus.commodity.category',
          keepAlive: true
        }
      }
    ]
  },
  // 仓库管理
  {
    id: 101,
    path: '/warehouse',
    name: 'Warehouse',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.warehouse.title',
      icon: '&#xe762;',
      keepAlive: false
    },
    children: [
      {
        id: 10101,
        path: 'list',
        name: 'WarehouseList',
        component: RoutesAlias.WarehouseList,
        meta: {
          title: 'menus.warehouse.list',
          keepAlive: true
        }
      },
      {
        id: 10102,
        path: 'category',
        name: 'WarehouseCategory',
        component: RoutesAlias.WarehouseCategory,
        meta: {
          title: 'menus.warehouse.category',
          keepAlive: true
        }
      }
    ]
  },
  // 库存管理
  {
    id: 102,
    path: '/inventory',
    name: 'Inventory',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.inventory.title',
      icon: '&#xe762;',
      keepAlive: false
    },
    children: [
      {
        id: 10201,
        path: 'list',
        name: 'InventoryList',
        component: RoutesAlias.InventoryList,
        meta: {
          title: 'menus.inventory.list',
          keepAlive: true
        }
      },
      {
        id: 10202,
        path: 'entryRecord',
        name: 'InventoryEntryRecord',
        component: RoutesAlias.InventoryEntryRecord,
        meta: {
          title: 'menus.inventory.entryRecord',
          keepAlive: true
        }
      },
      {
        id: 10203,
        path: 'outRecord',
        name: 'InventoryOutRecord',
        component: RoutesAlias.InventoryOutRecord,
        meta: {
          title: 'menus.inventory.outRecord',
          keepAlive: true
        }
      }
    ]
  },
  // 车辆管理
  {
    id: 102,
    path: '/vehicle',
    name: 'Vehicle',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.vehicle.title',
      icon: '&#xe7fa;',
      keepAlive: false
    },
    children: [
      {
        id: 10201,
        path: 'list',
        name: 'VehicleList',
        component: RoutesAlias.VehicleList,
        meta: {
          title: 'menus.vehicle.list',
          keepAlive: true
        }
      },
      {
        id: 10202,
        path: 'category',
        name: 'VehicleCategory',
        component: RoutesAlias.VehicleCategory,
        meta: {
          title: 'menus.vehicle.category',
          keepAlive: true
        }
      }
    ]
  },
  // 订单管理
  {
    id: 104,
    path: '/order',
    name: 'Order',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.order.title',
      icon: '&#xe84d;',
      keepAlive: false
    },
    children: [
      {
        id: 10401,
        path: 'application',
        name: 'OrderApplication',
        component: RoutesAlias.OrderApplication,
        meta: {
          title: 'menus.order.application',
          keepAlive: true
        }
      },
      {
        id: 10402,
        path: 'list',
        name: 'OrderList',
        component: RoutesAlias.OrderList,
        meta: {
          title: 'menus.order.list',
          keepAlive: true
        }
      },
      {
        id: 10403,
        path: 'records',
        name: 'OrderRecords',
        component: RoutesAlias.OrderRecords,
        meta: {
          title: 'menus.order.records',
          keepAlive: true
        }
      },
      {
        id: 10404,
        path: 'category',
        name: 'OrderCategory',
        component: RoutesAlias.OrderCategory,
        meta: {
          title: 'menus.order.category',
          keepAlive: true
        }
      }
    ]
  },
  // 任务管理
  {
    id: 105,
    path: '/task',
    name: 'task',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.task.title',
      icon: '&#xe662;',
      keepAlive: false
    },
    children: [
      {
        id: 10501,
        path: 'list',
        name: 'TaskList',
        component: RoutesAlias.TaskList,
        meta: {
          title: 'menus.task.list',
          keepAlive: true
        }
      },
      {
        id: 10502,
        path: 'release',
        name: 'TaskRelease',
        component: RoutesAlias.TaskRelease,
        meta: {
          title: 'menus.task.release',
          keepAlive: true
        }
      },
      {
        id: 10503,
        path: 'records',
        name: 'TaskRecords',
        component: RoutesAlias.TaskRecords,
        meta: {
          title: 'menus.task.records',
          keepAlive: true
        }
      },
      {
        id: 10504,
        path: 'category',
        name: 'TaskCategory',
        component: RoutesAlias.TaskCategory,
        meta: {
          title: 'menus.task.category',
          keepAlive: true
        }
      }
    ]
  },
  // 配送管理
  {
    id: 106,
    path: '/distribution',
    name: 'distribution',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.distribution.title',
      icon: '&#xe802;',
      keepAlive: false
    },
    children: [
      {
        id: 10601,
        path: 'list',
        name: 'DistributionList',
        component: RoutesAlias.DistributionList,
        meta: {
          title: 'menus.distribution.list',
          keepAlive: true
        }
      },
      {
        id: 10602,
        path: 'records',
        name: 'DistributionRecords',
        component: RoutesAlias.DistributionRecords,
        meta: {
          title: 'menus.distribution.records',
          keepAlive: true
        }
      },
      {
        id: 10603,
        path: 'signedList',
        name: 'DistributionSignedList',
        component: RoutesAlias.DistributionSignedList,
        meta: {
          title: 'menus.distribution.signedList',
          keepAlive: true
        }
      },
      {
        id: 10604,
        path: 'exceptionRecords',
        name: 'DistributionExceptionRecords',
        component: RoutesAlias.DistributionExceptionRecords,
        meta: {
          title: 'menus.distribution.exceptionRecords',
          keepAlive: true
        }
      },
      {
        id: 10605,
        path: 'category',
        name: 'DistributionCategory',
        component: RoutesAlias.DistributionCategory,
        meta: {
          title: 'menus.distribution.category',
          keepAlive: true
        }
      }
    ]
  },

  {
    id: 5,
    path: '/widgets',
    name: 'Widgets',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.widgets.title',
      icon: '&#xe81a;',
      keepAlive: false
    },
    children: [
      {
        id: 503,
        path: 'icon-list',
        name: 'IconList',
        component: RoutesAlias.IconList,
        meta: {
          title: 'menus.widgets.iconList',
          keepAlive: true
        }
      },
      {
        id: 504,
        path: 'icon-selector',
        name: 'IconSelector',
        component: RoutesAlias.IconSelector,
        meta: {
          title: 'menus.widgets.iconSelector',
          keepAlive: true
        }
      },
      {
        id: 505,
        path: 'image-crop',
        name: 'ImageCrop',
        component: RoutesAlias.ImageCrop,
        meta: {
          title: 'menus.widgets.imageCrop',
          keepAlive: true
        }
      },
      {
        id: 506,
        path: 'excel',
        name: 'Excel',
        component: RoutesAlias.Excel,
        meta: {
          title: 'menus.widgets.excel',
          keepAlive: true
        }
      },
      {
        id: 507,
        path: 'video',
        name: 'Video',
        component: RoutesAlias.Video,
        meta: {
          title: 'menus.widgets.video',
          keepAlive: true
        }
      },
      {
        id: 508,
        path: 'count-to',
        name: 'CountTo',
        component: RoutesAlias.CountTo,
        meta: {
          title: 'menus.widgets.countTo',
          keepAlive: false
        }
      },
      {
        id: 509,
        path: 'wang-editor',
        name: 'WangEditor',
        component: RoutesAlias.WangEditor,
        meta: {
          title: 'menus.widgets.wangEditor',
          keepAlive: true
        }
      },
      {
        id: 510,
        path: 'watermark',
        name: 'Watermark',
        component: RoutesAlias.Watermark,
        meta: {
          title: 'menus.widgets.watermark',
          keepAlive: true
        }
      },
      {
        id: 511,
        path: 'context-menu',
        name: 'ContextMenu',
        component: RoutesAlias.ContextMenu,
        meta: {
          title: 'menus.widgets.contextMenu',
          keepAlive: true
        }
      },
      {
        id: 512,
        path: 'qrcode',
        name: 'Qrcode',
        component: RoutesAlias.Qrcode,
        meta: {
          title: 'menus.widgets.qrcode',
          keepAlive: true
        }
      },
      {
        id: 513,
        path: 'drag',
        name: 'Drag',
        component: RoutesAlias.Drag,
        meta: {
          title: 'menus.widgets.drag',
          keepAlive: true
        }
      },
      {
        id: 514,
        path: 'text-scroll',
        name: 'TextScroll',
        component: RoutesAlias.TextScroll,
        meta: {
          title: 'menus.widgets.textScroll',
          keepAlive: true
        }
      },
      {
        id: 515,
        path: 'fireworks',
        name: 'Fireworks',
        component: RoutesAlias.Fireworks,
        meta: {
          title: 'menus.widgets.fireworks',
          keepAlive: true,
          showTextBadge: 'Hot'
        }
      },
      {
        id: 516,
        path: '/outside/iframe/elementui',
        name: 'ElementUI',
        component: '',
        meta: {
          title: 'menus.widgets.elementUI',
          keepAlive: false,
          link: 'https://element-plus.org/zh-CN/component/overview.html',
          isIframe: true,
          showBadge: true
        }
      }
    ]
  },
  {
    id: 126,
    path: '/template',
    name: 'Template',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.template.title',
      icon: '&#xe860;',
      keepAlive: false
    },
    children: [
      {
        id: 12602,
        path: 'cards',
        name: 'Cards',
        component: RoutesAlias.Cards,
        meta: {
          title: 'menus.template.cards',
          keepAlive: false
        }
      },
      {
        id: 12603,
        path: 'banners',
        name: 'Banners',
        component: RoutesAlias.Banners,
        meta: {
          title: 'menus.template.banners',
          keepAlive: false
        }
      },
      {
        id: 12604,
        path: 'charts',
        name: 'Charts',
        component: RoutesAlias.Charts,
        meta: {
          title: 'menus.template.charts',
          keepAlive: false
        }
      },
      {
        id: 12609,
        path: 'map',
        name: 'Map',
        component: RoutesAlias.Map,
        meta: {
          title: 'menus.template.map',
          keepAlive: true,
          showTextBadge: 'new'
        }
      },
      {
        id: 12601,
        path: 'chat',
        name: 'Chat',
        component: RoutesAlias.Chat,
        meta: {
          title: 'menus.template.chat',
          keepAlive: true
        }
      },
      {
        id: 12605,
        path: 'calendar',
        name: 'Calendar',
        component: RoutesAlias.Calendar,
        meta: {
          title: 'menus.template.calendar',
          keepAlive: true
        }
      },
      {
        id: 12622,
        path: 'pricing',
        name: 'Pricing',
        component: RoutesAlias.Pricing,
        meta: {
          title: 'menus.template.pricing',
          keepAlive: true,
          isHideTab: true
        }
      }
    ]
  },
  {
    id: 4,
    path: '/article',
    name: 'Article',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.article.title',
      icon: '&#xe7ae;',
      keepAlive: true
    },
    children: [
      {
        id: 202,
        path: 'article-list',
        name: 'ArticleList',
        component: RoutesAlias.ArticleList,
        meta: {
          title: 'menus.article.articleList',
          keepAlive: true,
          authList: [
            {
              id: 2021,
              title: '新增',
              auth_mark: 'add'
            },
            {
              id: 2022,
              title: '编辑',
              auth_mark: 'edit'
            }
          ]
        }
      },

      {
        id: 204,
        path: 'detail',
        name: 'ArticleDetail',
        component: RoutesAlias.ArticleDetail,
        meta: {
          title: 'menus.article.articleDetail',
          isHide: true,
          keepAlive: true
        }
      },
      {
        id: 205,
        path: 'comment',
        name: 'Comment',
        component: RoutesAlias.Comment,
        meta: {
          title: 'menus.article.comment',
          keepAlive: true
        }
      },
      {
        id: 201,
        path: 'article-publish',
        name: 'ArticlePublish',
        component: RoutesAlias.ArticlePublish,
        meta: {
          title: 'menus.article.articlePublish',
          keepAlive: true,
          authList: [
            {
              id: 2010,
              title: '发布',
              auth_mark: 'article/article-publish/add'
            }
          ]
        }
      }
    ]
  },
  {
    id: 3,
    path: '/menu',
    name: 'Menu',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.menu.title',
      icon: '&#xe8a4;',
      keepAlive: false
    },
    children: [
      {
        id: 401,
        path: 'menu',
        name: 'Menus',
        component: RoutesAlias.Menu,
        meta: {
          title: 'menus.menu.menu',
          icon: '&#xe8a4;',
          keepAlive: true,
          authList: [
            {
              id: 4011,
              title: '新增',
              auth_mark: 'add'
            },
            {
              id: 4012,
              title: '编辑',
              auth_mark: 'edit'
            },
            {
              id: 4013,
              title: '删除',
              auth_mark: 'delete'
            }
          ]
        }
      },
      {
        id: 411,
        path: 'permission',
        name: 'Permission',
        component: RoutesAlias.Permission,
        meta: {
          title: 'menus.menu.permission',
          icon: '&#xe831;',
          showTextBadge: 'new',
          keepAlive: true,
          authList: [
            {
              id: 4111,
              title: '新增',
              auth_mark: 'add'
            },
            {
              id: 4112,
              title: '编辑',
              auth_mark: 'edit'
            },
            {
              id: 4113,
              title: '删除',
              auth_mark: 'delete'
            }
          ]
        }
      },
      {
        id: 402,
        path: 'nested',
        name: 'Nested',
        component: '',
        meta: {
          title: 'menus.menu.nested',
          icon: '&#xe676;',
          keepAlive: true
        },
        children: [
          {
            id: 40201,
            path: 'menu1',
            name: 'NestedMenu1',
            component: RoutesAlias.NestedMenu1,
            meta: {
              title: 'menus.menu.menu1',
              icon: '&#xe676;',
              keepAlive: true
            }
          },
          {
            id: 40202,
            path: 'menu2',
            name: 'NestedMenu2',
            component: '',
            meta: {
              title: 'menus.menu.menu2',
              icon: '&#xe676;',
              keepAlive: true
            },
            children: [
              {
                id: 4020201,
                path: 'menu2-1',
                name: 'NestedMenu2-1',
                component: RoutesAlias.NestedMenu21,
                meta: {
                  title: 'menus.menu.menu21',
                  icon: '&#xe676;',
                  keepAlive: true
                }
              }
            ]
          },
          {
            id: 40203,
            path: 'menu3',
            name: 'NestedMenu3',
            component: '',
            meta: {
              title: 'menus.menu.menu3',
              icon: '&#xe676;',
              keepAlive: true
            },
            children: [
              {
                id: 4020301,
                path: 'menu3-1',
                name: 'NestedMenu3-1',
                component: RoutesAlias.NestedMenu31,
                meta: {
                  title: 'menus.menu.menu31',
                  icon: '&#xe676;',
                  keepAlive: true
                }
              },
              {
                id: 4020302,
                path: 'menu3-2',
                name: 'NestedMenu3-2',
                component: '',
                meta: {
                  title: 'menus.menu.menu32',
                  icon: '&#xe676;',
                  keepAlive: true
                },
                children: [
                  {
                    id: 402030201,
                    path: 'menu3-2-1',
                    name: 'NestedMenu3-2-1',
                    component: RoutesAlias.NestedMenu321,
                    meta: {
                      title: 'menus.menu.menu321',
                      icon: '&#xe676;',
                      keepAlive: true
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 18,
    path: '/result',
    name: 'Result',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.result.title',
      icon: '&#xe715;',
      keepAlive: false
    },
    children: [
      {
        id: 401,
        path: 'success',
        name: 'Success',
        component: RoutesAlias.Success,
        meta: {
          title: 'menus.result.success',
          keepAlive: true
        }
      },
      {
        id: 402,
        path: 'fail',
        name: 'Fail',
        component: RoutesAlias.Fail,
        meta: {
          title: 'menus.result.fail',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: 8,
    path: '/exception',
    name: 'Exception',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.exception.title',
      icon: '&#xe820;',
      keepAlive: false
    },
    children: [
      {
        id: 801,
        path: '403',
        name: '403',
        component: RoutesAlias.Exception403,
        meta: {
          title: 'menus.exception.notFound',
          keepAlive: true
        }
      },
      {
        id: 802,
        path: '404',
        name: '404',
        component: RoutesAlias.Exception404,
        meta: {
          title: 'menus.exception.notFoundEn',
          keepAlive: true
        }
      },
      {
        id: 803,
        path: '500',
        name: '500',
        component: RoutesAlias.Exception500,
        meta: {
          title: 'menus.exception.serverError',
          keepAlive: true
        }
      }
    ]
  },

  {
    id: 10,
    path: '/safeguard',
    name: 'Safeguard',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.safeguard.title',
      icon: '&#xe816;',
      keepAlive: false
    },
    children: [
      {
        id: 1010,
        path: 'server',
        name: 'Server',
        component: RoutesAlias.Server,
        meta: {
          title: 'menus.safeguard.server',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: 12,
    name: '',
    path: '',
    component: RoutesAlias.Home,
    meta: {
      title: 'menus.help.title',
      icon: '&#xe719;',
      keepAlive: false
    },
    children: [
      {
        id: 1101,
        path: '',
        name: 'Document',
        meta: {
          title: 'menus.help.document',
          link: 'https://www.lingchen.kim/art-design-pro/docs/',
          isIframe: false,
          keepAlive: false
        }
      }
    ]
  },
  // 一级菜单
  {
    id: 11912,
    name: 'ChangeLog',
    path: '/log/changeLog',
    component: '/log/ChangeLog',
    meta: {
      title: 'menus.plan.log',
      showTextBadge: `${upgradeLogList.value[0].version}`,
      icon: '&#xe712;',
      keepAlive: false,
      isInMainContainer: true
    }
  }
]
