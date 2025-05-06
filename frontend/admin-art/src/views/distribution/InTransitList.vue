<template>
  <div class="page-content">
    <!-- 表格顶栏 -->
    <table-bar
      :showTop="false"
      @search="search"
      @reset="resetForm(true)"
      @changeColumn="changeColumn"
      :columns="columns"
    >
      <template #top>
        <el-form :model="searchForm" ref="searchFormRef" label-width="82px">
          <el-row :gutter="20">
            <form-input label="任务ID" prop="id" v-model="searchForm.id" />
            <form-select label="商品" prop="inventoryId" v-model="searchForm.inventoryId" :options="commodityOptions" />
          </el-row>
        </el-form>
      </template>
    </table-bar>

    <!-- 表格 -->
    <art-table
      v-bind="tableData"
      selection
      @selection-change="changeSelect"
      @current-change="changePage"
      @size-change="changePageSizes"
    >
      <template #extend-column>
        <el-table-column type="expand">
          <template #default="scope">
            <el-descriptions
              class="margin-top"
              title="发货人"
              border
              :column="2"
              size="small"
              style="max-width: 900px; margin: 0 60px 20px"
            >
              <el-descriptions-item label="用户名" width="150" label-width="50">
                {{ scope.row.order.user.username }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号" width="150" label-width="50">
                {{ scope.row.order.user.phone }}
              </el-descriptions-item>
              <el-descriptions-item label="地址" width="150" label-width="50">
                {{ scope.row.order.fromProvince }}{{ scope.row.order.fromCity }}{{ scope.row.order.fromDistrict }}
                {{ scope.row.order.fromAddress }}
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions
              title="收货人"
              border
              :column="2"
              size="small"
              style="max-width: 900px; margin: 0 60px 20px"
            >
              <el-descriptions-item label="客户名" width="150" label-width="50">
                {{ scope.row.order.receiver }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号" width="150" label-width="50">
                {{ scope.row.order.phone }}
              </el-descriptions-item>
              <el-descriptions-item label="地址" width="150" label-width="50">
                {{ scope.row.order.toProvince }}{{ scope.row.order.toCity }}{{ scope.row.order.toDistrict }}
                {{ scope.row.order.toAddress }}
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions border size="small" style="max-width: 900px; margin: 0 60px 20px">
              <el-descriptions-item label="描述" width="150" label-width="110">
                {{ scope.row.order.desc }}
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
      </template>

      <template #default>
        <el-table-column label="配送ID" prop="id" min-width="120" v-if="columns[0].show" />
        <el-table-column label="状态" prop="status" sortable #default="scope" min-width="100" v-if="columns[1].show">
          <el-tag :type="statusMap[scope.row.status].type"> {{ statusMap[scope.row.status].name }} </el-tag>
        </el-table-column>
        <el-table-column label="商品名" prop="name" min-width="120" #default="scope" v-if="columns[2].show">
          {{ scope.row.order.inventory.commodity.name }}
        </el-table-column>
        <el-table-column
          label="分类"
          prop="categoryId"
          sortable
          #default="scope"
          min-width="120"
          v-if="columns[3].show"
        >
          <el-tag type="info"> {{ scope.row.order.category.name }} </el-tag>
        </el-table-column>
        <el-table-column
          label="始发地"
          prop="fromAddress"
          sortable
          #default="scope"
          min-width="220"
          v-if="columns[3].show"
        >
          {{ scope.row.order.fromProvince }}{{ scope.row.order.fromCity }}{{ scope.row.order.fromDistrict }}
          {{ scope.row.order.fromAddress }}
        </el-table-column>
        <el-table-column
          label="目的地"
          prop="toAddress"
          sortable
          #default="scope"
          min-width="220"
          v-if="columns[3].show"
        >
          {{ scope.row.order.toProvince }}{{ scope.row.order.toCity }}{{ scope.row.order.toDistrict }}
          {{ scope.row.order.toAddress }}
        </el-table-column>
        <el-table-column label="备注" prop="desc" min-width="120" v-if="columns[5].show" />
        <el-table-column label="创建日期" prop="createdAt" sortable min-width="120" v-if="columns[6].show" />
        <el-table-column fixed="right" label="操作" #default="scope" width="180">
          <button-table
            v-show="scope.row.status === 2"
            type="edit"
            icon=" "
            text="配送路线"
            @click="showDialog('progress', scope.row)"
          />
          <button-table type="edit" icon=" " text="详情" @click="showDialog('detail', scope.row)" />
        </el-table-column>
      </template>
    </art-table>

    <!-- 表单 -->
    <el-dialog v-model="dialogVisible" :title="'任务详情'" width="700px">
      <template v-if="dialogType === 'detail'">
        <el-descriptions
          class="margin-top"
          title="订单详情"
          border
          :column="2"
          size="small"
          style="max-width: 900px; margin: 0 60px 20px"
        >
          <el-descriptions-item label="订单类型" width="150" label-width="50">
            {{ formData?.order.category.name }}
          </el-descriptions-item>
          <el-descriptions-item label="商品名" width="150" label-width="50">
            {{ formData?.order.inventory.commodity.name }}
          </el-descriptions-item>
          <el-descriptions-item label="商品数量" width="150" label-width="50">
            {{ formData?.order.total }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          class="margin-top"
          title="发货人"
          border
          :column="2"
          size="small"
          style="max-width: 900px; margin: 0 60px 20px"
        >
          <el-descriptions-item label="用户名" width="150" label-width="50">
            {{ formData?.order.user.username }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号" width="150" label-width="50">
            {{ formData?.order.user.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="地址" width="150" label-width="50">
            {{ formData?.order.fromProvince }}{{ formData?.order.fromCity }}{{ formData?.order.fromDistrict }}
            {{ formData?.order.fromAddress }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="收货人" border :column="2" size="small" style="max-width: 900px; margin: 0 60px 20px">
          <el-descriptions-item label="客户名" width="150" label-width="50">
            {{ formData?.order.receiver }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号" width="150" label-width="50">
            {{ formData?.order.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="地址" width="150" label-width="50">
            {{ formData?.order.toProvince }}{{ formData?.order.toCity }}{{ formData?.order.toDistrict }}
            {{ formData?.order.toAddress }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions border size="small" style="max-width: 900px; margin: 0 60px 20px">
          <el-descriptions-item label="备注" width="150" label-width="110">
            {{ formData?.order.desc }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <template v-else>
        <AMap ref="AMapTemp" :start="fullFromAddress" :end="fullToAddress" :id="formData?.id" style="height: 500px" />
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelForm">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { getPCA, type CascadeDataWithNull } from 'lcn'
  import type { OrderData, UserData, OrderCategoryData, CommodityData, DistributionData } from '@/api'
  import { UserService, OrderCategoryService, CommodityService, DistributionService } from '@/api'
  import { PaginationData } from '@/types/axios'
  import { FormInstance } from 'element-plus'
  import AMap from './AMap.vue'

  //-------- 表格逻辑 --------//
  const tableData = ref<PaginationData<DistributionData[]>>({
    records: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
  })

  const commodityOptions = ref<{ name: string; value: number }[]>([])
  const userOptions = ref<{ name: string; value: number }[]>([])
  const categoryOptions = ref<{ name: string; value: number }[]>([])

  const statusMap: Record<number, { name: string; value: number; type: 'success' | 'info' | 'warning' | 'primary' }> = {
    1: { name: '待配送', value: 1, type: 'info' },
    2: { name: '配送中', value: 2, type: 'info' },
    3: { name: '已送达', value: 3, type: 'primary' },
    4: { name: '已签收', value: 4, type: 'success' },
    5: { name: '异常', value: 5, type: 'warning' }
  }

  const columns = reactive([
    { name: '任务ID', show: true },
    { name: '状态', show: true },
    { name: '商品名', show: true },
    { name: '分类', show: true },
    { name: '数量', show: true },
    { name: '描述', show: true },
    { name: '创建日期', show: true }
  ])

  const selection = ref<OrderData[]>([])

  onMounted(() => {
    getListData()
    initOptionData()
    getPCAData()
  })

  // 切换列
  function changeColumn(list: any) {
    columns.values = list
  }

  function getPCAData() {
    addressOptions.value = getPCA({ fieldNames: { code: 'value', name: 'name' } })
  }

  // 商品数据请求
  async function getCommodityListData() {
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

  // 客户数据请求
  async function getUserListData() {
    try {
      const res = await UserService.getList()
      if (res.success) {
        userOptions.value = res.data.map((item: UserData) => {
          return { name: item.username, value: item.id }
        })
      }
    } catch {
      // 错误已在axios拦截器处理
    }
  }

  // 分类数据请求
  async function getCategoryListData() {
    try {
      const res = await OrderCategoryService.getList()
      if (res.success) {
        categoryOptions.value = res.data.map((item: OrderCategoryData) => {
          return { name: item.name, value: item.id }
        })
      }
    } catch {
      // 错误已在axios拦截器处理
    }
  }

  function initOptionData() {
    getUserListData()
    getCategoryListData()
    getCommodityListData()
  }

  // 列表数据请求
  async function getListData() {
    try {
      const { currentPage, pageSize } = tableData.value
      const res = await DistributionService.getPage({ currentPage, pageSize, status: 2, ...searchForm.value })
      if (res.success) {
        tableData.value = res.data
      }
    } catch {
      // 错误已在axios拦截器处理
    }
  }

  // 选择数据
  function changeSelect(_selection: OrderData[]) {
    selection.value = _selection
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
  const dialogType = ref('accept')
  const dialogVisible = ref(false)

  const rowId = ref<number | undefined>()

  const searchDefaultData = {
    id: undefined,
    inventoryId: undefined
  }

  const searchForm = ref({ ...searchDefaultData })
  const formData = ref<DistributionData>()

  const addressOptions = ref<CascadeDataWithNull[]>([])

  const fullFromAddress = computed(() => {
    const { fromProvince, fromCity, fromDistrict, fromAddress } = formData.value?.order || {}
    return [fromProvince, fromCity, fromDistrict, fromAddress].filter(Boolean).join('')
  })

  const fullToAddress = computed(() => {
    const { toProvince, toCity, toDistrict, toAddress } = formData.value?.order || {}
    return [toProvince, toCity, toDistrict, toAddress].filter(Boolean).join('')
  })

  // 显示表单
  function showDialog(type: string, row?: any) {
    dialogType.value = type
    rowId.value = row.id

    if (type === 'detail' && row) {
      dialogVisible.value = true
      initOptionData()
      formData.value = row
    } else {
      dialogVisible.value = true
      formData.value = row
    }
  }

  // 搜索
  function search() {
    getListData()
  }

  // 重置表单
  function resetForm(isSearch?: boolean) {
    if (isSearch) {
      searchFormRef.value?.resetFields()
      searchForm.value = { ...searchDefaultData }
      getListData()
    }
  }

  // 取消表单
  function cancelForm() {
    dialogVisible.value = false
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
