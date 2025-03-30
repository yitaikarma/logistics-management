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
            <form-select label="仓库" prop="warehouseId" v-model="searchForm.warehouseId" :options="warehouseOptions" />
            <form-select label="商品" prop="commodityId" v-model="searchForm.commodityId" :options="commodityOptions" />
          </el-row>
        </el-form>
      </template>
      <template #bottom>
        <el-button @click="showDialog('add')" v-ripple>入库</el-button>
        <el-button style="margin: 0" :disabled="tableData.total === 0" @click="showDialog('sub')" v-ripple
          >出库</el-button
        >
      </template>
    </table-bar>

    <!-- 表格 -->
    <art-table v-bind="tableData" @current-change="changePage" @size-change="changePageSizes">
      <template #extend-column>
        <el-table-column type="expand" style="padding: 0">
          <template #default="scope">
            <el-table
              :data="scope.row.inventoryExtensions"
              size="small"
              stripe
              style="width: calc(100% - 50px); margin: 0 0 0 50px"
            >
              <el-table-column label="仓库" prop="name" min-width="120" #default="scope">
                <el-tag type="info"> {{ scope.row.warehouse.name }} </el-tag>
              </el-table-column>
              <el-table-column label="库存数量" prop="total" min-width="120" />
            </el-table>
          </template>
        </el-table-column>
      </template>
      <template #default>
        <el-table-column label="商品名" prop="commodityId" min-width="120" #default="scope" v-if="columns[0].show">
          <el-tag type="info"> {{ scope.row.commodity.name }} </el-tag>
        </el-table-column>
        <el-table-column label="库存数量" prop="total" min-width="120" v-if="columns[1].show" />
        <el-table-column label="描述" prop="desc" min-width="120" v-if="columns[3].show" />
        <el-table-column label="创建日期" prop="createdAt" sortable min-width="120" v-if="columns[4].show" />
      </template>
    </art-table>

    <!-- 表单 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '入库商品' : '出库商品'"
      width="500px"
      @close="cancelForm"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="商品名" prop="commodityId">
          <el-select v-model="formData.commodityId" @change="resetSelect">
            <el-option
              v-for="item in formData.type === 1 ? commodityOptions : commodityInventoryOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库名" prop="warehouseId">
          <el-select v-model="formData.warehouseId">
            <el-option
              v-for="item in formData.type === 1 ? warehouseOptions : warehouseInventoryOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库存数量" prop="total">
          <el-input-number
            v-model="formData.total"
            :placeholder="totalPlaceholder"
            :min="0"
            :max="formData.type === 1 ? 9999999999 : +totalPlaceholder"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelForm">取消</el-button>
          <el-button type="primary" :loading="formLoading" @click="handleSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import type { FormRules } from 'element-plus'
  import type { CommodityData, InventoryData, WarehouseData } from '@/api'
  import { CommodityService, InventoryService, WarehouseService } from '@/api'
  import { PaginationData } from '@/types/axios'
  import { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'

  //-------- 表格逻辑 --------//
  const columns = reactive([
    { name: '商品名', show: true },
    { name: '库存数量', show: true },
    { name: '仓库', show: true },
    { name: '描述', show: true },
    { name: '创建日期', show: true }
  ])

  const tableData = ref<PaginationData<InventoryData[]>>({
    records: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
  })

  const commodityOptions = ref<{ name: string; value: number }[]>([])
  const warehouseOptions = ref<{ name: string; value: number }[]>([])

  onMounted(() => {
    getListData()
    initOptionData()
  })

  // 切换列
  function changeColumn(list: any) {
    columns.values = list
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

  function initOptionData() {
    getWarehousesData()
    getCommoditiesData()
    getInventoryCommoditiesAndWarehousesData()
  }

  // 列表数据请求
  async function getListData() {
    try {
      const { currentPage, pageSize } = tableData.value
      const res = await InventoryService.getPage({ currentPage, pageSize, ...searchForm.value })
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

  //-------- 出库可选数据逻辑（只能选择有库存的数据） --------//
  const inventoryData = ref<InventoryData[]>([])
  const commodityInventoryOptions = ref<{ name: string; value: number }[]>([])
  const warehouseInventoryOptions = computed(() => {
    return (
      inventoryData.value
        .find((item) => {
          return item.id === formData.value.commodityId
        })
        ?.inventoryExtensions.map((item) => {
          return { name: item.warehouse.name, value: item.warehouse.id }
        }) || []
    )
  })

  // 库存商品和仓库数据请求
  async function getInventoryCommoditiesAndWarehousesData() {
    try {
      const res = await InventoryService.getList()
      if (res.success) {
        inventoryData.value = res.data
        commodityInventoryOptions.value = res.data.map((item: InventoryData) => {
          return { name: item.commodity.name, value: item.id }
        })
      }
    } catch {
      // 错误已在axios拦截器处理
    }
  }

  //-------- 搜索和表单逻辑 --------//
  const searchFormRef = ref<FormInstance>()
  const formRef = ref<FormInstance>()
  const dialogType = ref('add')
  const dialogVisible = ref(false)
  const formLoading = ref(false)

  const searchDefaultData = {
    type: undefined as number | undefined,
    total: undefined,
    warehouseId: undefined,
    commodityId: undefined,
    address: '',
    desc: '',
    status: undefined
  }
  const formDefaultData = {
    type: undefined as number | undefined,
    total: undefined,
    warehouseId: undefined,
    commodityId: undefined,
    address: '',
    desc: '',
    status: undefined
  }
  const searchForm = ref({ ...searchDefaultData })
  const formData = ref({ ...formDefaultData })

  const totalPlaceholder = ref('0')

  watch([() => formData.value.commodityId, () => formData.value.warehouseId], () => {
    if (formData.value.type === 2) {
      console.log(formData.value.commodityId)
      if (formData.value.commodityId && formData.value.warehouseId === undefined) {
        totalPlaceholder.value = inventoryData.value.find((item) => item.id === formData.value.commodityId)?.total + ''
      } else if (formData.value.commodityId && formData.value.warehouseId) {
        totalPlaceholder.value =
          inventoryData.value
            .find((item) => item.id === formData.value.commodityId)
            ?.inventoryExtensions.find((item) => item.warehouse.id === formData.value.warehouseId)?.total + ''
      }
    }
  })

  const rules = reactive<FormRules>({
    total: [{ required: true, message: '请输入库存数量', trigger: 'change' }],
    warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
    commodityId: [{ required: true, message: '请选择商品', trigger: 'change' }],
    address: [{ required: true, message: '请输入地址', trigger: 'change' }],
    desc: [{ required: true, message: '请输入库存描述', trigger: 'change' }],
    type: [{ required: true, message: '请选择状态', trigger: 'change' }]
  })

  // 显示表单
  function showDialog(type: string) {
    dialogVisible.value = true
    dialogType.value = type

    initOptionData()

    if (type === 'add') {
      formData.value.type = 1
    } else {
      formData.value.type = 2
    }
  }

  // 搜索
  function search() {
    getListData()
  }

  // 重置连选select
  function resetSelect() {
    formData.value.warehouseId = undefined
  }

  // 重置表单
  function resetForm(isSearch?: boolean) {
    if (isSearch) {
      searchFormRef.value?.resetFields()
      searchForm.value = { ...searchDefaultData }
      getListData()
    } else {
      formRef.value?.resetFields()
      formData.value = { ...formDefaultData }
    }
  }

  // 取消表单
  function cancelForm() {
    dialogVisible.value = false
    resetForm()
  }

  // 提交请求
  async function submitRequest() {
    if (!formRef.value) return

    formLoading.value = true
    try {
      let res = await InventoryService.add(formData.value)
      if (res.success) {
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
        dialogVisible.value = false
        resetForm()
        getListData()
      }
    } catch {
      // 错误已在axios拦截器处理
    } finally {
      formLoading.value = false
    }
  }

  // 提交表单
  async function handleSubmit() {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) submitRequest()
    })
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
