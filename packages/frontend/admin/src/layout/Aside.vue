<template>
  <a-layout-sider
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }"
      width="220">
    <div class="logo">
      物流仓库管理系统
    </div>
    <a-menu theme="dark" mode="inline">
      <a-sub-menu v-for="(item, index) in menus" :key="index">
        <span slot="title">
          <a-icon :type="item.icon"/>
          <span>{{ item.title }}</span>
        </span>
        <a-menu-item v-for="menu in item.children" :key="menu.title">
          <router-link :to="menu.path">
            {{ menu.title }}
          </router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script>

export default {

  data() {
    return {
      menus: [
        {
          title: '基础管理',
          icon: 'home',
          children: [
            {title: '商品管理', path: '/commodity'},
            {title: '来往单位', path: '/company'},
            {title: '员工管理', path: '/employee'},
            {title: '仓库管理', path: '/warehouse'},
          ]
        },
        {
          title: '销售管理',
          icon: 'pay-circle',
          children: [
            {title: '销售开票', path: '/sale/create'},
            {title: '销售记录', path: '/sale/record'},
          ]
        },
        {
          title: '配送管理',
          icon: 'car',
          children: [
            {title: '申请配送', path: '/delivery/create'},
            {title: '配送列表', path: '/delivery/list'},
          ]
        },
        {
          title: '运输管理',
          icon: 'rocket',
          children: [
            {title: '车辆资料', path: '/vehicle'},
            {title: '驾驶员资料', path: '/driver'},
          ]
        },
        {
          title: '图表分析',
          icon: 'line-chart',
          children: [
            {title: '入库分析', path: '/analyze/in'},
            {title: '出库分析', path: '/analyze/out'},
          ]
        },
        {
          title: '系统管理',
          icon: 'tool',
          children: [
            {title: '安全设置', path: '/security'},
            {title: '操作员管理', path: '/admin'},
            {title: '权限列表', path: '/role'}
          ]
        },
        {
          title: '日志管理',
          icon: 'file',
          children: [
            {title: '登录日志', path: '/loginlog'},
            {title: '操作日志', path: '/systemlog'}
          ]
        }
      ]
    }
  },

}

</script>

<style scoped>

#components-layout-demo-fixed-sider .logo {
  padding: 10px 15px;
  height: 50px;
  font-size: 15px;
  margin: 16px;
  color: #ffffff;
  letter-spacing: 2px;
}

.ant-menu {
  letter-spacing: 1px;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 5px;
}

</style>
