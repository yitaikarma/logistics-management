<template>
  <div class="page-content">
    <!-- 表格顶栏 -->
    <table-bar :showTop="false" @search="search" @reset="resetForm()" @changeColumn="changeColumn" :columns="columns">
      <template #top>
        <el-form :model="searchForm" ref="searchFormRef" label-width="82px">
          <el-row :gutter="20">
            <form-select
              label="仓库名"
              prop="warehouseId"
              v-model="searchForm.warehouseId"
              :options="warehouseOptions"
            />
            <form-select
              label="商品名"
              prop="commodityId"
              v-model="searchForm.commodityId"
              :options="commodityOptions"
            />
          </el-row>
        </el-form>
      </template>
    </table-bar>

    <!-- 表格 -->
    <art-table v-bind="tableData" @current-change="changePage" @size-change="changePageSizes">
      <template #default>
        <el-table-column label="商品名" prop="commodityId" min-width="120" #default="scope" v-if="columns[0].show">
          <el-tag type="info"> {{ scope.row.commodity.name }} </el-tag>
        </el-table-column>
        <el-table-column label="入库数量" prop="total" min-width="120" v-if="columns[1].show" />
        <el-table-column
          label="仓库"
          prop="warehouseId"
          sortable
          #default="scope"
          min-width="120"
          v-if="columns[2].show"
        >
          <el-tag type="info"> {{ scope.row.warehouse.name }} </el-tag>
        </el-table-column>
        <el-table-column label="创建日期" prop="createdAt" sortable min-width="120" v-if="columns[3].show" />
      </template>
    </art-table>
  </div>
</template>

<script setup lang="ts">
  import type { WarehouseData, CommodityData, InventoryRecordData } from '@/api'
  import { WarehouseService, CommodityService, InventoryRecordService } from '@/api'
  import { PaginationData } from '@/types/axios'
  import { FormInstance } from 'element-plus'
  import mittBus from '@/utils/mittBus'

  //-------- 表格逻辑 --------//
  const columns = reactive([
    { name: '商品名', show: true },
    { name: '仓库名', show: true },
    { name: '入库数量', show: true },
    { name: '创建日期', show: true }
  ])

  const tableData = ref<PaginationData<InventoryRecordData[]>>({
    records: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
  })

  const commodityOptions = ref<{ name: string; value: number }[]>([])
  const warehouseOptions = ref<{ name: string; value: number }[]>([])

  onMounted(() => {
    getListData()
    getWarehousesData()
    getCommoditiesData()
    mittBus.on('initData:EntryRecord', init)
  })

  // 切换列
  function changeColumn(list: any) {
    columns.values = list
  }

  function init() {
    console.log('init')

    getListData()
    getWarehousesData()
    getCommoditiesData()
  }

  // 仓库数据请求
  async function getWarehousesData() {
    try {
      const res = await WarehouseService.getList()
      if (res.success) {
        warehouseOptions.value = res.data.map((item: WarehouseData) => {
          return { name: item.name, value: item.id }
        })
      }
    } catch {
      // 错误已在axios拦截器处理
    }
  }

  // 商品数据请求
  async function getCommoditiesData() {
    try {
      const res = await CommodityService.getList()
      if (res.success) {
        commodityOptions.value = res.data.map((item: CommodityData) => {
          return { name: item.name, value: item.id }
        })
      }
    } catch {
      // 错误已在axios拦截器处理
    }
  }

  // 列表数据请求
  async function getListData() {
    try {
      const { currentPage, pageSize } = tableData.value
      const res = await InventoryRecordService.getPage({ currentPage, pageSize, ...searchForm.value })
      if (res.success) {
        tableData.value = res.data
      }
    } catch {
      // 错误已在axios拦截器处理
    }
  }

  // 切换每页显示数量
  function changePageSizes(pageSize: number) {
    tableData.value.pageSize = pageSize
    getListData()
  }

  // 切换页码
  function changePage(page: number) {
    tableData.value.currentPage = page
    getListData()
  }

  //-------- 搜索和表单逻辑 --------//
  const searchFormRef = ref<FormInstance>()

  const searchDefaultData = {
    total: undefined,
    warehouseId: undefined,
    commodityId: undefined,
    address: '',
    desc: '',
    type: 1,
    status: undefined
  }

  const searchForm = ref({ ...searchDefaultData })

  // 搜索
  function search() {
    getListData()
  }

  // 重置表单
  function resetForm() {
    searchFormRef.value?.resetFields()
    searchForm.value = { ...searchDefaultData }
    getListData()
  }
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;

    .user {
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 6px;
      }

      > div {
        margin-left: 10px;

        .user-name {
          font-weight: 500;
          color: var(--art-text-gray-800);
        }
      }
    }
  }
</style>
