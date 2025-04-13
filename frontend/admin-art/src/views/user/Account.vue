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
            <form-input label="用户名" prop="name" v-model="searchForm.username" />
            <form-input label="手机号" prop="phone" v-model="searchForm.phone" />
            <form-input label="邮箱" prop="email" v-model="searchForm.email" />
          </el-row>
          <el-row :gutter="20">
            <form-select label="性别" prop="gender" v-model="searchForm.gender" :options="genderOptions" />
            <form-select label="权限" prop="role" v-model="searchForm.role" :options="roleOptions" />
            <form-select label="状态" prop="status" v-model="searchForm.status" :options="statusOptions" />
          </el-row>
        </el-form>
      </template>
      <template #bottom>
        <el-button @click="showDialog('add')" v-ripple>添加用户</el-button>
      </template>
    </table-bar>

    <!-- 表格 -->
    <art-table v-bind="tableData" selection @current-change="changePage" @size-change="changePageSizes">
      <template #default>
        <el-table-column label="用户名" prop="avatar" #default="scope" width="300px" v-if="columns[0].show">
          <div class="user" style="display: flex; align-items: center">
            <img class="avatar" :src="scope.row.avatar" />
            <div>
              <p class="user-name">{{ scope.row.username }}</p>
              <p class="email">{{ scope.row.email }}</p>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" min-width="130" v-if="columns[1].show" />
        <el-table-column label="性别" prop="gender" #default="scope" sortable min-width="100" v-if="columns[2].show">
          {{ genderMap[scope.row.gender] }}
        </el-table-column>
        <el-table-column label="权限" prop="role" min-width="120" v-if="columns[3].show">
          <template #default="scope">
            <el-tag>{{ roleMap[scope.row.role] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" sortable min-width="100" v-if="columns[4].show">
          <template #default="scope">
            <el-tag :type="statusTypeMap[scope.row.status]">
              {{ statusMap[scope.row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="createdAt" sortable min-width="120" v-if="columns[5].show" />
        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <button-table type="edit" @click="showDialog('edit', scope.row)" />
            <button-table type="delete" @click="deleteUser" />
          </template>
        </el-table-column>
      </template>
    </art-table>

    <!-- 表单 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="500px"
      @close="cancelForm"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'add'" label="密码" prop="password">
          <el-input v-model="formData.password" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="formData.gender">
            <el-option v-for="item in genderOptions" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="role">
          <el-select
            v-model="formData.role"
            @change="(val) => (formData.roleId = roleOptions.find((item) => item.value === val)!.value)"
          >
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
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
  import type { FormRules } from 'element-plus'
  import type { RoleData, UserData } from '@/api'
  import type { PaginationData } from '@/types/axios'
  import { FormInstance } from 'element-plus'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { RoleService, UserService } from '@/api'

  //-------- 表格逻辑 --------//
  const genderOptions = [
    { value: 0, name: '保密' },
    { value: 1, name: '男' },
    { value: 2, name: '女' }
  ]
  const genderMap = Object.fromEntries(genderOptions.map((item) => [item.value, item.name]))

  const roleOptions = ref<Pick<RoleData, 'name' | 'value'>[]>([])
  const roleMap = computed(() => Object.fromEntries(roleOptions.value.map((item) => [item.value, item.name])))

  const statusOptions = [
    { value: 1, name: '在线', type: 'success' } as const,
    { value: 2, name: '离线', type: 'info' } as const,
    { value: 3, name: '异常', type: 'warning' } as const,
    { value: 4, name: '注销', type: 'danger' } as const
  ]
  const statusMap = Object.fromEntries(statusOptions.map((item) => [item.value, item.name]))
  const statusTypeMap = Object.fromEntries(statusOptions.map((item) => [item.value, item.type]))

  const columns = reactive([
    { name: '用户名', show: true },
    { name: '手机号', show: true },
    { name: '性别', show: true },
    { name: '权限', show: true },
    { name: '状态', show: true },
    { name: '创建日期', show: true }
  ])

  const tableData = ref<PaginationData<UserData[]>>({
    records: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
  })

  onMounted(() => {
    getListData()
    getRoleList()
  })

  // 切换列
  function changeColumn(list: any) {
    columns.values = list
  }

  // 获取列表数据
  async function getRoleList() {
    try {
      const res = await RoleService.getList()
      if (res.success) {
        roleOptions.value = res.data.map((item) => {
          return {
            ...item,
            value: item.id,
            name: item.name
          }
        })
      } else {
        ElMessage.error(res.message)
      }
    } catch {
      ElMessage.error('执行错误')
    }
  }
  // 获取列表数据
  async function getListData() {
    try {
      const { currentPage, pageSize } = tableData.value
      const res = await UserService.getPage({ currentPage, pageSize, ...searchForm.value })
      if (res.success) {
        tableData.value = res.data
      } else {
        ElMessage.error(res.message)
      }
    } catch {
      ElMessage.error('执行错误')
    }
  }

  // 删除数据
  async function deleteUser() {
    try {
      await ElMessageBox.confirm('确定要注销该用户吗？', '注销用户', {
        type: 'error',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      if (!rowId.value) {
        ElMessage.error('执行错误，用户ID获取错误')
      } else {
        const res = await UserService.delete(rowId.value)
        if (!res.success) {
          ElMessage.error(res.message)
        } else {
          getListData()
          ElMessage.success('注销成功')
        }
      }
    } catch {
      ElMessage.error('执行错误')
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

  const rowId = ref<number | undefined>()
  const formDefaultData = {
    username: '',
    phone: '',
    email: '',
    gender: undefined,
    role: undefined,
    roleId: undefined as number | undefined,
    password: '' as string | undefined,
    status: undefined
  }
  const searchForm = ref({ ...formDefaultData })
  const formData = ref({ ...formDefaultData })

  const rules = reactive<FormRules>({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      // { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
      { pattern: /^\d{11}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    role: [{ required: true, message: '请选择部门', trigger: 'change' }]
  })

  // 显示表单
  function showDialog(type: string, row?: any) {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'edit' && row) {
      rowId.value = row.id
      formData.value.username = row.username
      formData.value.email = row.email
      formData.value.phone = row.phone
      formData.value.gender = row.gender
      formData.value.role = row.role
      formData.value.roleId = row.roleId
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
      searchForm.value = { ...formDefaultData }
      getListData()
      getRoleList()
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
            res = await UserService.add(formData.value)
          } else {
            if (!rowId.value) {
              ElMessage.error('执行错误，用户ID不存在')
              return
            }
            delete formData.value.password
            res = await UserService.update(rowId.value, formData.value)
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
          ElMessage.error('执行错误')
        }
      }
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
