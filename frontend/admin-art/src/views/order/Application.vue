<template>
  <div class="page-content application">
    <div v-if="stepActive === 0" class="form-wrapper">
      <h2 style="margin-top: 20px">订单申请</h2>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" style="width: 600px">
        <el-form-item label="分类" prop="categoryId">
          <el-radio-group v-model="formData.categoryId">
            <el-radio-button v-for="item in categoryOptions" :key="item.value" :label="item.name" :value="item.value" />
          </el-radio-group>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="13">
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
          <el-col :span="11">
            <el-form-item label="数量" prop="total">
              <el-input-number
                v-model="formData.total"
                :min="0"
                :max="+totalPlaceholder"
                :placeholder="totalPlaceholder"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">收货人</el-divider>
        <el-row :gutter="20">
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
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="地址" prop="toProvince">
              <el-select v-model="formData.toProvince" @change="resetSelect(true)">
                <el-option v-for="item in provinceOptions" :key="item.value" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label-width="0" prop="toCity">
              <el-select v-model="formData.toCity" @change="resetSelect()">
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
      </el-form>
    </div>

    <div v-if="stepActive === 1" class="success">
      <i class="iconfont-sys icon">&#xe617;</i>
      <h1 class="title">提交成功</h1>
      <p class="msg"
        >提交结果页用于反馈一系列操作任务的处理结果，如果仅是简单操作，使用 Message
        全局提示反馈即可。灰色区域可以显示一些补充的信息。</p
      >
      <div class="res">
        <p>已提交申请，等待部门审核。</p>
      </div>
    </div>

    <div class="btn-group">
      <el-button v-show="stepActive === 0" v-ripple @click="resetForm">重置</el-button>
      <el-button v-show="stepActive === 0" :loading="formLoading" type="primary" v-ripple @click="handleSubmit">
        提交订单
      </el-button>
      <el-button v-show="stepActive === 1" v-ripple @click="toListPage">去列表查看</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { FormRules, FormInstance } from 'element-plus'
  import { getPCA, type CascadeDataWithNull } from 'lcn'
  import type { CommodityData, InventoryData, OrderCategoryData, UserData } from '@/api'
  import { CommodityService, InventoryService, OrderCategoryService, OrderService, UserService } from '@/api'
  import { useUserStore } from '@/store/modules/user'
  import mittBus from '@/utils/mittBus'

  const userStore = useUserStore()
  const router = useRouter()

  const commodityOptions = ref<{ name: string; value: number }[]>([])
  const userOptions = ref<{ name: string; value: number }[]>([])
  const categoryOptions = ref<{ name: string; value: number }[]>([])

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

  onMounted(() => {
    initOptionData()
  })

  function initOptionData() {
    getUserListData()
    getCategoryListData()
    getCommodityListData()
    getInventoryCommoditiesAndWarehousesData()
    getPCAData()
  }

  // 省市区数据
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
        categoryOptions.value = res.data
          .map((item: OrderCategoryData) => {
            return { name: item.name, value: item.id }
          })
          .reverse()
        formData.value.categoryId = categoryOptions.value[0].value
      }
    } catch {
      // 错误已在axios拦截器处理
    }
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

  // 表单相关
  const formRef = ref<FormInstance | null>(null)
  const formLoading = ref(false)
  const dialogVisible = ref(false)
  const stepActive = ref(0)

  const formDefaultData = {
    total: undefined as number | undefined,
    receiver: '',
    phone: '',
    toProvince: '',
    toCity: '',
    toDistrict: '',
    toAddress: '',
    desc: '',
    status: 1,
    categoryId: undefined as number | undefined,
    userId: undefined as number | undefined,
    inventoryId: undefined as number | undefined
  }
  const formData = ref({ ...formDefaultData })

  const rules = reactive<FormRules>({
    inventoryId: [{ required: true, message: '请选择商品', trigger: 'change' }],
    categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
    total: [{ required: true, message: '请输入数量', trigger: 'change' }],
    receiver: [{ required: true, message: '请输入客户名', trigger: 'change' }],
    phone: [{ required: true, message: '请输入手机号', trigger: 'change' }],
    toProvince: [{ required: true, message: '请选择收货省份', trigger: 'change' }],
    toCity: [{ required: true, message: '请选择收货城市', trigger: 'change' }],
    toDistrict: [{ required: true, message: '请选择收货区', trigger: 'change' }],
    toAddress: [{ required: true, message: '请输入收货详细地址', trigger: 'change' }],
    desc: [{ required: true, message: '请输入订单描述', trigger: 'change' }]
  })

  // 实时商品总数
  const totalPlaceholder = ref('0')
  watch(
    () => formData.value.inventoryId,
    () => {
      const commodityInventory = inventoryData.value.find((item) => item.id === formData.value.inventoryId)
      if (commodityInventory) {
        totalPlaceholder.value = commodityInventory.inventoryExtensions
          .reduce((prev, cur) => {
            return cur.total > prev ? cur.total : prev
          }, 0)
          .toString()
      }
    }
  )

  // 跳转到列表页
  function toListPage() {
    router.push('/order/list')
    stepActive.value = 0
  }

  // 重置连选select
  function resetSelect(isProvince = false) {
    if (isProvince) {
      formData.value.toCity = ''
    }
    formData.value.toDistrict = ''
  }

  // 重置表单
  function resetForm() {
    formRef.value?.resetFields()
    formData.value = { ...formDefaultData }
  }

  // 提交请求
  async function submitRequest() {
    formLoading.value = true
    try {
      formData.value.userId = userStore.getUserInfo.id
      const res = await OrderService.add(formData.value)
      if (res.success) {
        ElMessage.success('申请成功')
        dialogVisible.value = false
        resetForm()
        mittBus.emit('initData:OrderList')
        mittBus.emit('initData:ReviewList')
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

    const valid = await formRef.value.validate()
    console.log('valid', valid)

    if (valid) {
      await submitRequest()
      stepActive.value++
    }
  }
</script>

<style lang="scss" scoped>
  .application {
    padding-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 80px;
    box-sizing: border-box;
    padding: 15px 100px !important;
    text-align: center;
  }

  .form-wrapper {
    padding-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 80px;
    box-sizing: border-box;
    padding: 15px 100px !important;
    text-align: center;
  }

  .success {
    box-sizing: border-box;
    padding: 15px 100px !important;
    text-align: center;

    .icon {
      display: block;
      margin-top: 6vh;
      font-size: 80px;
      color: #19be6b !important;
    }

    .title {
      margin-top: 20px;
      font-size: 30px;
      font-weight: 500;
      color: var(--art-text-gray-900) !important;
    }

    .msg {
      margin-top: 20px;
      font-size: 16px;
      color: #808695;
    }

    .res {
      padding: 22px 30px;
      margin-top: 30px;
      text-align: left;
      background-color: #f8f8f9;
      border-radius: 5px;

      p {
        padding: 8px 0;
        font-size: 15px;
        color: #808695;
      }
    }
  }

  .dark {
    .success {
      .res {
        background: #28282a;
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .success {
      padding: 15px 25px !important;

      .icon {
        margin-top: 4vh;
        font-size: 60px;
      }

      .title {
        margin-top: 10px;
        font-size: 25px;
      }

      .res {
        padding: 10px 30px;
      }
    }
  }
</style>
