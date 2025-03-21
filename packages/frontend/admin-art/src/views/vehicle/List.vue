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
            <form-input label="车辆名" prop="name" v-model="searchForm.name" />
            <form-select label="分类" prop="categoryId" v-model="searchForm.categoryId" :options="categoryOptions" />
            <form-select label="司机" prop="userId" v-model="searchForm.userId" :options="userOptions" />
            <form-input label="车牌号" prop="license" v-model="searchForm.license" />
            <form-select label="状态" prop="status" v-model="searchForm.status" :options="statusOptions" />
          </el-row>
        </el-form>
      </template>
      <template #bottom>
        <el-button @click="showDialog('add')" v-ripple>添加车辆</el-button>
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
      <template #default>
        <el-table-column label="车辆名" prop="name" min-width="120" v-if="columns[0].show" />
        <el-table-column
          label="分类"
          prop="categoryId"
          sortable
          #default="scope"
          min-width="120"
          v-if="columns[1].show"
        >
          <el-tag type="info"> {{ scope.row.category.name }} </el-tag>
        </el-table-column>
        <el-table-column label="司机" prop="username" min-width="120" #default="scope" v-if="columns[2].show">
          <el-tag type="info"> {{ scope.row.user.username }} </el-tag>
        </el-table-column>
        <el-table-column label="车牌号" prop="license" min-width="120" v-if="columns[3].show" />
        <el-table-column label="描述" prop="desc" min-width="120" v-if="columns[4].show" />
        <el-table-column label="状态" prop="status" sortable #default="scope" min-width="100" v-if="columns[5].show">
          <el-tag :type="statusMap[scope.row.status].type"> {{ statusMap[scope.row.status].name }} </el-tag>
        </el-table-column>
        <el-table-column label="创建日期" prop="createdAt" sortable min-width="120" v-if="columns[6].show" />
        <el-table-column fixed="right" label="操作" #default="scope" width="150px">
          <button-table type="edit" @click="showDialog('edit', scope.row)" />
          <button-table type="delete" @click="del" />
        </el-table-column>
      </template>
    </art-table>

    <!-- 表单 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '添加车辆' : '编辑车辆'" width="500px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="车辆名" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="车牌号" prop="license">
          <el-input v-model="formData.license" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="formData.categoryId">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="司机" prop="userId">
          <el-select v-model="formData.userId">
            <el-option v-for="item in userOptions" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="formData.desc" type="textarea" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
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
  import type { VehicleData, UserData, VehicleCategoryData } from '@/api'
  import { VehicleService, UserService, VehicleCategoryService } from '@/api'
  import { PaginationData } from '@/types/axios'
  import { FormInstance } from 'element-plus'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import EmojiText from '@/utils/emojo'

  //-------- 表格逻辑 --------//
  const statusMap: Record<number, { name: string; value: number; type: 'success' | 'info' }> = {
    0: { name: '禁用', value: 0, type: 'info' },
    1: { name: '启用', value: 1, type: 'success' }
  }
  const statusOptions = Object.values(statusMap)

  const columns = reactive([
    { name: '车辆名', show: true },
    { name: '分类', show: true },
    { name: '司机', show: true },
    { name: '车牌号', show: true },
    { name: '描述', show: true },
    { name: '状态', show: true },
    { name: '创建日期', show: true }
  ])

  const tableData = ref<PaginationData<VehicleData[]>>({
    records: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
  })

  const userOptions = ref<{ name: string; value: number }[]>([])
  const categoryOptions = ref<{ name: string; value: number }[]>([])

  const selection = ref<VehicleData[]>([])

  onMounted(() => {
    getListData()
    getUserListData()
    getCategoryListData()
  })

  // 切换列
  function changeColumn(list: any) {
    columns.values = list
  }

  // 司机数据请求
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
      const res = await VehicleCategoryService.getList()
      if (res.success) {
        categoryOptions.value = res.data.map((item: VehicleCategoryData) => {
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
      const res = await VehicleService.getPage({ currentPage, pageSize, ...searchForm.value })
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
      ElMessage.error(`${EmojiText[400]} 执行错误，车辆ID获取错误`)
    } else {
      VehicleService.delete(rowId.value).then((res) => {
        if (res.success) {
          getListData()
          ElMessage.success(`${EmojiText[200]} 移除成功`)
        }
      })
    }
  }

  // 选择数据
  function changeSelect(_selection: VehicleData[]) {
    selection.value = _selection
  }

  // 删除数据
  async function del() {
    try {
      await ElMessageBox.confirm('确定要移除该车辆吗？', '移除车辆', {
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

  //-------- 搜索和表单逻辑 --------//
  const searchFormRef = ref<FormInstance>()
  const formRef = ref<FormInstance>()
  const dialogType = ref('add')
  const dialogVisible = ref(false)
  const formLoading = ref(false)

  const rowId = ref<number | undefined>()

  const searchDefaultData = {
    name: '',
    categoryId: undefined,
    userId: undefined,
    license: '',
    desc: '',
    status: undefined
  }
  const formDefaultData = {
    name: '',
    categoryId: undefined,
    userId: undefined,
    license: '',
    desc: '',
    status: 1
  }
  const searchForm = ref({ ...searchDefaultData })
  const formData = ref({ ...formDefaultData })

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入车辆名', trigger: 'change' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
    ],
    categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
    userId: [{ required: true, message: '请选择司机', trigger: 'change' }],
    license: [{ required: true, message: '请输入车牌号', trigger: 'change' }],
    desc: [{ required: true, message: '请输入车辆描述', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }]
  })

  // 显示表单
  function showDialog(type: string, row?: any) {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'edit' && row) {
      rowId.value = row.id
      formData.value.name = row.name
      formData.value.categoryId = row.categoryId
      formData.value.userId = row.userId
      formData.value.license = row.license
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
      if (dialogType.value === 'add') {
        res = await VehicleService.add(formData.value)
      } else {
        if (!rowId.value) {
          ElMessage.error(`${EmojiText[400]} 执行错误，车辆ID不存在`)
          return
        }
        res = await VehicleService.update(rowId.value, formData.value)
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
