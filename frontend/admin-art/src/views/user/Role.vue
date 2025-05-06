<template>
  <div class="page-content">
    <!-- 头部烂 -->
    <el-row style="gap: 12px">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-input placeholder="权限角色名" v-model="searchForm.name"></el-input>
      </el-col>
      <el-col :xs="23" :sm="11" :lg="8" style="display: flex; flex-wrap: wrap; gap: 12px">
        <el-button v-ripple @click="search">搜索</el-button>
        <el-button style="margin: 0" v-ripple @click="resetForm(true)">重置</el-button>
        <el-button style="margin: 0" type="info" @click="showDialog('add')" v-ripple>新增角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <art-table v-bind="tableData" selection @current-change="changePage" @size-change="changePageSizes">
      <template #default>
        <el-table-column label="状态" prop="status" #default="scope" min-width="120">
          <el-tag :type="statusMap[scope.row.status].type">
            {{ statusMap[scope.row.status].text }}
          </el-tag>
        </el-table-column>
        <el-table-column label="角色名称" prop="name" min-width="120" />
        <el-table-column label="描述" prop="desc" min-width="120" />
        <el-table-column label="创建时间" prop="createdAt" min-width="120"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100px">
          <template #default="scope">
            <el-row>
              <button-more :list="moreBtnList" @click="buttonMoreClick($event, scope.row)" />
            </el-row>
          </template>
        </el-table-column>
      </template>
    </art-table>
    <!-- 表单 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      width="500"
      @close="cancelForm"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限值" prop="value">
          <el-input v-model="formData.value" />
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

    <el-dialog v-model="permissionDialog" title="菜单权限" width="500">
      <div :style="{ maxHeight: '500px', overflowY: 'scroll' }">
        <el-tree
          ref="treeRef"
          :data="menuList"
          show-checkbox
          default-expand-all
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
          :props="defaultProps"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelPermission">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules, TreeKey } from 'element-plus'
  import type { PaginationData } from '@/types/axios'
  import type { RoleData } from '@/api'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { ButtonMoreItem } from '@/components/Form/ButtonMore.vue'
  import { useMenuStore } from '@/store/modules/menu'
  import { RoleService } from '@/api'
  import { formatMenuTitle, pickMenu } from '@/utils/menu'
  import { registerAsyncRoutes } from '@/router/modules/dynamicRoutes'
  import { router } from '@/router'
  import { useUserStore } from '@/store/modules/user'

  const tableData = ref<PaginationData<RoleData[]>>({
    records: [],
    total: 0,
    currentPage: 1,
    pageSize: 10
  })

  const statusMap = {
    0: { text: '禁用', value: 0, type: 'info' },
    1: { text: '开启', value: 1, type: 'success' }
  }

  onMounted(getListData)

  /** 获取角色数据 */
  async function getListData() {
    try {
      const { currentPage, pageSize } = tableData.value
      const res = await RoleService.getPage({ currentPage, pageSize, ...searchForm.value })
      if (res.success) {
        tableData.value = res.data
      } else {
        ElMessage.error(res.message)
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

  const moreBtnList = ref<ButtonMoreItem[]>([
    { key: 'permission', label: '菜单权限' },
    { key: 'edit', label: '编辑角色' },
    { key: 'delete', label: '删除角色' }
  ])
  const rowId = ref<number>()
  const rowData = ref<RoleData>()

  // 列表行点击事件
  function buttonMoreClick(item: ButtonMoreItem, row: any) {
    rowId.value = row.id
    rowData.value = row
    if (item.key === 'permission') {
      showPermissionDialog()
    } else if (item.key === 'edit') {
      showDialog('edit', row)
    } else if (item.key === 'delete') {
      del()
    }
  }

  /**************** 对话框 **************/
  const dialogType = ref('add')
  const dialogVisible = ref(false)
  const permissionDialog = ref(false)
  const formRef = ref<FormInstance>()

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    value: [{ required: true, message: '请输入角色值', trigger: 'blur' }],
    desc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
  })

  const searchDefaultData = {
    name: '',
    value: undefined,
    desc: '',
    status: undefined
  }
  const formDefaultData = {
    name: '',
    value: 0,
    desc: '',
    status: 1
  }
  const searchForm = ref({ ...searchDefaultData })
  const formData = ref({ ...formDefaultData })

  // 显示表单
  function showDialog(type: string, row?: any) {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'edit' && row) {
      formData.value.name = row.name
      formData.value.value = row.value
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
            res = await RoleService.add(formData.value)
          } else {
            if (!rowId.value) {
              ElMessage.error('执行错误，用户ID不存在')
              return
            }
            res = await RoleService.update(rowId.value, formData.value)
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

  /** 删除角色数据 */
  async function del() {
    try {
      await ElMessageBox.confirm('确定删除该角色吗？', '注销用户', {
        type: 'error',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      if (!rowId.value) {
        ElMessage.error('执行错误，用户ID获取错误')
      } else {
        const res = await RoleService.delete(rowId.value)
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

  const treeRef = templateRef('treeRef')
  const menuList = computed(() => useMenuStore().getCompleteMenuList)
  const defaultProps = {
    children: 'children',
    label: (data: any) => formatMenuTitle(data.meta?.title) || ''
  }
  const defaultCheckedKeys = ref<TreeKey[]>([9, 901, 902, 903])
  const defaultExpandedKeys = ref<TreeKey[]>([1, 2, 3, 100])

  // 显示权限对话框
  function showPermissionDialog() {
    defaultCheckedKeys.value = rowData.value?.pageAuthString ? JSON.parse(rowData.value.pageAuthString) : []
    treeRef.value?.setCheckedKeys(defaultCheckedKeys.value)
    defaultExpandedKeys.value = defaultCheckedKeys.value
    permissionDialog.value = true
  }

  // 取消权限
  function cancelPermission() {
    permissionDialog.value = false
  }

  /** 添加和编辑角色 */
  async function handlePermissionSubmit() {
    if (!rowId.value) {
      ElMessage.error('执行错误，用户ID获取错误')
      return
    }
    if (!treeRef.value) {
      ElMessage.error('执行错误，树形控件获取错误')
      return
    }

    const checkedNodes = treeRef.value.getCheckedNodes(false, true)
    const checkedKeys = toRaw(checkedNodes).map((item) => item.id)
    console.log(checkedKeys)
    console.log(treeRef.value.getCheckedNodes(false, true))

    console.log(pickMenu(checkedKeys, toRaw(menuList.value)))

    const res = await RoleService.update(rowId.value, {
      pageAuthString: JSON.stringify(checkedKeys)
    })
    if (res.success) {
      ElMessage.success('设置成功')
      permissionDialog.value = false
      if (useUserStore().getUserInfo.roleId === rowId.value) {
        // 更新路由
        updatePageRouter(checkedKeys)
      }
      getListData()
    } else {
      ElMessage.error(res.message)
    }
  }

  /** 同步更新路由 */
  function updatePageRouter(checkedKeys: number[]) {
    const _menuList = toRaw(menuList.value)
    const userMenuList = pickMenu(checkedKeys, _menuList)
    // 设置菜单列表
    const finalMenuList = userMenuList?.length ? userMenuList : _menuList
    useMenuStore().setMenuList(finalMenuList as [])
    // 注册异步路由
    registerAsyncRoutes(router, userMenuList)
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
