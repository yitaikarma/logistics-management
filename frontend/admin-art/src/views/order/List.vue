<template>
  <div class="page-content">
    <!-- 表格顶栏 -->
    <table-bar
      :showTop="false"
      :show-delete-bottom="selection.length > 0"
      @search="search"
      @reset="resetForm(true)"
      @delete="del"
      @changeColumn="changeColumn"
      :columns="columns"
    >
      <template #top>
        <el-form :model="searchForm" ref="searchFormRef" label-width="82px">
          <el-row :gutter="20">
            <form-input label="订单ID" prop="id" v-model="searchForm.id" />
            <form-select label="商品" prop="inventoryId" v-model="searchForm.inventoryId" :options="commodityOptions" />
            <form-select label="分类" prop="categoryId" v-model="searchForm.categoryId" :options="categoryOptions" />
            <form-select label="状态" prop="status" v-model="searchForm.status" :options="statusOptions" />
          </el-row>
        </el-form>
      </template>
      <!-- <template #bottom>
        <el-button @click="showDialog('add')" v-ripple>添加订单</el-button>
      </template> -->
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
                {{ scope.row.user.username }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号" width="150" label-width="50">
                {{ scope.row.user.phone }}
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
                {{ scope.row.receiver }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号" width="150" label-width="50">
                {{ scope.row.phone }}
              </el-descriptions-item>
              <el-descriptions-item label="地址" width="150" label-width="50">
                {{ scope.row.toProvince }}{{ scope.row.toCity }}{{ scope.row.toDistrict }}
                {{ scope.row.toAddress }}
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions border size="small" style="max-width: 900px; margin: 0 60px 20px">
              <el-descriptions-item label="描述" width="150" label-width="110">
                {{ scope.row.desc }}
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
      </template>

      <template #default>
        <el-table-column label="订单ID" prop="id" min-width="120" v-if="columns[0].show" />
        <el-table-column label="状态" prop="status" sortable #default="scope" min-width="100" v-if="columns[5].show">
          <el-tag :type="statusMap[scope.row.status].type"> {{ statusMap[scope.row.status].name }} </el-tag>
        </el-table-column>
        <el-table-column label="商品名" prop="name" min-width="120" #default="scope" v-if="columns[1].show">
          {{ scope.row.inventory.commodity.name }}
        </el-table-column>
        <el-table-column
          label="分类"
          prop="categoryId"
          sortable
          #default="scope"
          min-width="120"
          v-if="columns[2].show"
        >
          <el-tag type="info"> {{ scope.row.category.name }} </el-tag>
        </el-table-column>
        <el-table-column label="数量" prop="total" min-width="120" v-if="columns[3].show" />
        <el-table-column label="描述" prop="desc" min-width="120" v-if="columns[4].show" />
        <el-table-column label="创建日期" prop="createdAt" sortable min-width="120" v-if="columns[6].show" />
        <el-table-column fixed="right" label="操作" #default="scope" width="150px">
          <button-table :disabled="scope.row.status !== 1" type="edit" @click="showDialog('edit', scope.row)" />
          <button-table :disabled="scope.row.status !== 1" type="delete" @click="del(scope.row)" />
        </el-table-column>
      </template>
    </art-table>

    <!-- 表单 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加订单' : '编辑订单'"
      width="700px"
      @close="cancelForm"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="分类" prop="categoryId">
          <el-radio-group v-model="formData.categoryId">
            <el-radio-button v-for="item in categoryOptions" :key="item.value" :label="item.name" :value="item.value" />
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="商品" prop="inventoryId">
              <el-select v-model="formData.inventoryId">
                <template #label="{ label, value }">
                  <span style="margin-right: 6px">{{ label }}</span>
                  <span style="color: var(--el-text-color-secondary); font-size: 11px">
                    {{ inventoryData.find((i) => i.id === value)?.total }} 件
                  </span>
                </template>
                <el-option
                  v-for="item in commodityInventoryOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                  <span style="margin-right: 6px">{{ item.name }}</span>
                  <span style="color: var(--el-text-color-secondary); font-size: 11px"> {{ item.total }} 件 </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量" prop="total">
              <el-input-number v-model="formData.total" :min="0" :max="99999999" :placeholder="totalPlaceholder" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">收货人</el-divider>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="姓名" prop="receiver">
              <el-input v-model="formData.receiver" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="地址" prop="toProvince">
              <el-select v-model="formData.toProvince">
                <el-option v-for="item in provinceOptions" :key="item.value" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label-width="0" prop="toCity">
              <el-select v-model="formData.toCity">
                <el-option v-for="item in toCityOptions" :key="item.value" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label-width="0" prop="toDistrict">
              <el-select v-model="formData.toDistrict">
                <el-option v-for="item in toDistrictOptions" :key="item.value" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详细地址" prop="toAddress">
          <el-input v-model="formData.toAddress" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="formData.desc" type="textarea" />
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
        </el-form-item> -->
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
  import { getPCA, type CascadeDataWithNull } from 'lcn'
  import type { FormRules } from 'element-plus'
  import type { OrderData, UserData, OrderCategoryData, CommodityData, InventoryData } from '@/api'
  import { OrderService, UserService, OrderCategoryService, CommodityService, InventoryService } from '@/api'
  import { PaginationData } from '@/types/axios'
  import { FormInstance } from 'element-plus'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import EmojiText from '@/utils/emojo'
  import { useUserStore } from '@/store/modules/user'
  import mittBus from '@/utils/mittBus'

  const userStore = useUserStore()

  //-------- 表格逻辑 --------//
  const tableData = ref<PaginationData<OrderData[]>>({
    records: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
  })

  const commodityOptions = ref<{ name: string; value: number }[]>([])
  const userOptions = ref<{ name: string; value: number }[]>([])
  const categoryOptions = ref<{ name: string; value: number }[]>([])

  const statusMap: Record<number, { name: string; value: number; type: 'success' | 'info' }> = {
    0: { name: '已取消', value: 0, type: 'info' },
    1: { name: '审核中', value: 1, type: 'success' },
    2: { name: '分配中', value: 2, type: 'success' },
    3: { name: '未通过', value: 3, type: 'info' },
    4: { name: '待配送', value: 4, type: 'info' },
    5: { name: '配送中', value: 5, type: 'info' },
    6: { name: '已送达', value: 6, type: 'success' }
  }
  const statusOptions = Object.values(statusMap)

  const columns = reactive([
    { name: '订单ID', show: true },
    { name: '商品名', show: true },
    { name: '分类', show: true },
    { name: '数量', show: true },
    { name: '描述', show: true },
    { name: '状态', show: true },
    { name: '创建日期', show: true }
  ])

  const selection = ref<OrderData[]>([])

  onMounted(() => {
    init()
    getPCAData()
    mittBus.on('initData:OrderList', init)
  })

  function init() {
    getListData()
    initOptionData()
  }

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
      const res = await OrderService.getPage({ currentPage, pageSize, ...searchForm.value })
      if (res.success) {
        tableData.value = res.data
      }
    } catch {
      // 错误已在axios拦截器处理
    }
  }

  // 删除数据请求
  function deleteRequest() {
    if (!rowId.value) {
      ElMessage.error(`${EmojiText[400]} 执行错误，订单ID获取错误`)
    } else {
      OrderService.delete(rowId.value).then((res) => {
        if (res.success) {
          getListData()
          ElMessage.success(`${EmojiText[200]} 移除成功`)
        }
      })
    }
  }

  // 选择数据
  function changeSelect(_selection: OrderData[]) {
    selection.value = _selection
  }

  // 删除数据
  async function del(row) {
    if (row.status !== 1) {
      return
    }
    try {
      await ElMessageBox.confirm('确定要移除该订单吗？', '移除订单', {
        type: 'error',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })

      deleteRequest()
    } catch {
      ElMessage.info(`已取消`)
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
  const commodityInventoryOptions = ref<({ name: string; value: number } & InventoryData)[]>([])

  // 库存商品和仓库数据请求
  async function getInventoryCommoditiesAndWarehousesData() {
    try {
      const res = await InventoryService.getList()
      if (res.success) {
        inventoryData.value = res.data
        commodityInventoryOptions.value = res.data.map((item: InventoryData) => {
          return { ...item, name: item.commodity.name, value: item.id }
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

  const rowId = ref<number | undefined>()

  const searchDefaultData = {
    id: undefined,
    inventoryId: undefined as number | undefined,
    categoryId: undefined,
    desc: '',
    status: undefined
  }
  const formDefaultData = {
    total: undefined as number | undefined,
    receiver: '',
    phone: '',
    fromProvince: '',
    fromCity: '',
    fromDistrict: '',
    fromAddress: '',
    toProvince: '',
    toCity: '',
    toDistrict: '',
    toAddress: '',
    desc: '',
    status: 1,
    categoryId: undefined,
    userId: undefined as number | undefined,
    inventoryId: undefined as number | undefined,
    warehouseId: undefined
  }
  const searchForm = ref({ ...searchDefaultData })
  const formData = ref({ ...formDefaultData })

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入订单名', trigger: 'change' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
    ],
    inventoryId: [{ required: true, message: '请选择商品', trigger: 'change' }],
    categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
    total: [{ required: true, message: '请输入数量', trigger: 'change' }],
    receiver: [{ required: true, message: '请输入客户名', trigger: 'change' }],
    phone: [{ required: true, message: '请输入手机号', trigger: 'change' }],
    fromProvince: [{ required: true, message: '请选择发货省份', trigger: 'change' }],
    fromCity: [{ required: true, message: '请选择发货城市', trigger: 'change' }],
    fromDistrict: [{ required: true, message: '请选择发货区', trigger: 'change' }],
    fromAddress: [{ required: true, message: '请输入发货详细地址', trigger: 'change' }],
    toProvince: [{ required: true, message: '请选择收货省份', trigger: 'change' }],
    toCity: [{ required: true, message: '请选择收货城市', trigger: 'change' }],
    toDistrict: [{ required: true, message: '请选择收货区', trigger: 'change' }],
    toAddress: [{ required: true, message: '请输入收货详细地址', trigger: 'change' }],
    desc: [{ required: true, message: '请输入订单描述', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }]
  })

  const addressOptions = ref<CascadeDataWithNull[]>([])
  const provinceOptions = computed(() => {
    return addressOptions.value.map((i) => ({ name: i.name, value: i.name }))
  })
  const toCityOptions = computed(() => {
    return addressOptions.value.find((i) => i.name === formData.value.toProvince)?.children || []
  })
  const toDistrictOptions = computed(() => {
    return toCityOptions.value.find((i) => i.name === formData.value.toCity)?.children || []
  })

  const totalPlaceholder = ref('0')
  watch(
    () => formData.value.warehouseId,
    () => {
      const commodityInventory = inventoryData.value.find((item) => item.id === formData.value.inventoryId)
      if (commodityInventory) {
        totalPlaceholder.value =
          commodityInventory.inventoryExtensions
            .find((item) => item.warehouse.id === formData.value.warehouseId)
            ?.toString() ?? '0'
      }
    }
  )

  // 显示表单
  function showDialog(type: string, row?: any) {
    if (row.status !== 1) {
      return
    }
    dialogVisible.value = true
    dialogType.value = type

    initOptionData()
    getInventoryCommoditiesAndWarehousesData()

    if (type === 'edit' && row) {
      rowId.value = row.id
      formData.value.inventoryId = row.inventoryId
      formData.value.categoryId = row.categoryId
      formData.value.total = row.total
      formData.value.receiver = row.receiver
      formData.value.phone = row.phone
      formData.value.fromProvince = row.fromProvince
      formData.value.fromCity = row.fromCity
      formData.value.fromDistrict = row.fromDistrict
      formData.value.fromAddress = row.fromAddress
      formData.value.toProvince = row.toProvince
      formData.value.toCity = row.toCity
      formData.value.toDistrict = row.toDistrict
      formData.value.toAddress = row.toAddress
      formData.value.desc = row.desc
      formData.value.status = row.status
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
      let res
      formData.value.userId = userStore.getUserInfo.id
      if (dialogType.value === 'add') {
        res = await OrderService.add(formData.value)
      } else {
        if (!rowId.value) {
          ElMessage.error(`${EmojiText[400]} 执行错误，订单ID不存在`)
          return
        }
        res = await OrderService.update(rowId.value, formData.value)
      }

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
