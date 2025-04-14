<template>
  <div class="page-content">
    <!-- 头部栏 -->
    <el-row style="gap: 12px">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-input placeholder="订单分类名" v-model="searchForm.name"></el-input>
      </el-col>
      <el-col :xs="23" :sm="11" :lg="8" style="display: flex; flex-wrap: wrap; gap: 12px">
        <el-button v-ripple @click="search">搜索</el-button>
        <el-button style="margin: 0" v-ripple @click="resetForm(true)">重置</el-button>
        <el-button style="margin: 0" type="info" @click="showDialog('add')" v-ripple>新增分类</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <art-table v-bind="tableData" selection @current-change="changePage" @size-change="changePageSizes">
      <template #default>
        <el-table-column label="状态" prop="status" min-width="120" #default="scope">
          <el-tag :type="statusMap[scope.row.status].type"> {{ statusMap[scope.row.status].name }} </el-tag>
        </el-table-column>
        <el-table-column label="订单分类名" prop="name" min-width="120" />
        <el-table-column label="描述" prop="desc" min-width="120" />
        <el-table-column label="创建时间" prop="createdAt" min-width="120"></el-table-column>
        <el-table-column fixed="right" label="操作" #default="scope" width="150px">
          <button-table type="edit" @click="showDialog('edit', scope.row)" />
          <button-table type="delete" @click="del" />
        </el-table-column>
      </template>
    </art-table>

    <!-- 表单 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增订单分类' : '编辑订单分类'"
      width="500"
      @close="cancelForm"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="订单分类名" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="formData.desc" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelForm">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import type { OrderCategoryData } from '@/api'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { OrderCategoryService } from '@/api'
  import { PaginationData } from '@/types/axios'

  const tableData = ref<PaginationData<OrderCategoryData[]>>({
    records: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
  })
  const rowId = ref<number>()

  const statusMap: Record<number, { name: string; value: number; type: 'success' | 'info' }> = {
    0: { name: '禁用', value: 0, type: 'info' },
    1: { name: '启用', value: 1, type: 'success' }
  }

  onMounted(getListData)

  // 获取列表数据
  async function getListData() {
    try {
      const { currentPage, pageSize } = tableData.value
      console.log(searchForm.value)

      const res = await OrderCategoryService.getPage({ currentPage, pageSize, ...searchForm.value })
      if (res.success) {
        tableData.value = res.data
      } else {
        ElMessage.error(res.message)
      }
    } catch {
      // 错误已在 axios 拦截器处理
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

  const dialogType = ref('add')
  const dialogVisible = ref(false)
  const formRef = ref<FormInstance>()

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入订单分类名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    desc: [{ required: true, message: '请输入订单分类描述', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
  })

  const searchDefaultData = {
    name: '',
    desc: '',
    status: undefined
  }
  const formDefaultData = {
    name: '',
    desc: '',
    status: 1
  }
  const searchForm = ref({ ...searchDefaultData })
  const formData = ref({ ...formDefaultData })

  // 显示表单
  function showDialog(type: string, row?: any) {
    dialogVisible.value = true
    dialogType.value = type
    console.log(row)

    if (type === 'edit' && row) {
      rowId.value = row.id
      formData.value.name = row.name
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

  // 提交表单
  async function handleSubmit() {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          let res
          if (dialogType.value === 'add') {
            res = await OrderCategoryService.add(formData.value)
          } else {
            if (!rowId.value) {
              ElMessage.error('执行错误，用户ID不存在')
              return
            }
            res = await OrderCategoryService.update(rowId.value, formData.value)
          }

          if (!res.success) {
            ElMessage.error(res.message)
          } else {
            ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
            dialogVisible.value = false
            resetForm()
            getListData()
          }
        } catch {
          // 错误已在 axios 拦截器处理
        }
      }
    })
  }

  // 删除数据
  async function del() {
    try {
      await ElMessageBox.confirm('确定删除该订单分类吗？', '注销用户', {
        type: 'error',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      if (!rowId.value) {
        ElMessage.error('执行错误，用户ID获取错误')
      } else {
        const res = await OrderCategoryService.delete(rowId.value)
        if (!res.success) {
          ElMessage.error(res.message)
        } else {
          getListData()
          ElMessage.success('注销成功')
        }
      }
    } catch {
      // 错误已在 axios 拦截器处理
    }
  }
</script>

<style lang="scss" scoped>
  .page-content {
    .svg-icon {
      width: 1.8em;
      height: 1.8em;
      overflow: hidden;
      vertical-align: -8px;
      fill: currentcolor;
    }
  }
</style>
