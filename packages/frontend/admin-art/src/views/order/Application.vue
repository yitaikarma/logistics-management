<template>
  <div class="page-content application">
    <el-steps
      style="min-width: 500px; max-width: 600px"
      align-center
      :active="stepActive"
      process-status="finish"
      finish-status="success"
    >
      <el-step title="下单" />
      <el-step title="结果" />
    </el-steps>

    <el-form
      v-if="stepActive === 0"
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      style="width: 500px"
    >
      <el-form-item label="商品名" prop="commodityId">
        <el-select v-model="formData.commodityId">
          <el-option v-for="item in commodityOptions" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="formData.categoryId">
          <el-option v-for="item in categoryOptions" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户名" prop="userId">
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

    <div v-if="stepActive === 1" class="success">
      <i class="iconfont-sys icon">&#xe6f7;</i>
      <h1 class="title">提交成功</h1>
      <div class="res">
        <p>已提交申请，等待部门审核。</p>
      </div>
    </div>
    <div v-if="stepActive === 2" class="success">
      <i class="iconfont-sys icon">&#xe617;</i>
      <h1 class="title">订单已受理</h1>
      <p class="msg"
        >提交结果页用于反馈一系列操作任务的处理结果，如果仅是简单操作，使用 Message
        全局提示反馈即可。灰色区域可以显示一些补充的信息。</p
      >
      <div class="res">
        <p>已提交申请，等待部门审核。</p>
      </div>
    </div>

    <div class="btn-group">
      <!-- <el-button v-ripple @click="nextStep">上一步</el-button> -->
      <el-button type="primary" v-ripple @click="nextStep">下一步</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { OrderService } from '@/api'
  import { FormInstance } from 'element-plus'

  // 表单相关
  const formRef = ref<FormInstance | null>(null)
  const formLoading = ref(false)
  const dialogVisible = ref(false)

  const commodityOptions = ref([
    { value: '1', name: '商品1' },
    { value: '2', name: '商品2' },
    { value: '3', name: '商品3' }
  ])

  const categoryOptions = ref([
    { value: '1', name: '分类1' },
    { value: '2', name: '分类2' },
    { value: '3', name: '分类3' }
  ])

  const userOptions = ref([
    { value: '1', name: '用户1' },
    { value: '2', name: '用户2' },
    { value: '3', name: '用户3' }
  ])

  const formDefaultData = {
    commodityId: '',
    categoryId: '',
    userId: '',
    desc: '',
    status: 0
  }

  const formData = ref({ ...formDefaultData })

  const rules = computed(() => ({
    commodityId: [{ required: true, message: '请选择商品', trigger: 'blur' }],
    categoryId: [{ required: true, message: '请选择分类', trigger: 'blur' }],
    userId: [{ required: true, message: '请选择客户', trigger: 'blur' }],
    desc: [{ required: true, message: '请输入描述', trigger: 'blur' }]
  }))

  // 重置表单
  function resetForm() {
    formRef.value?.resetFields()
    formData.value = { ...formDefaultData }
  }

  // 提交请求
  async function submitRequest() {
    if (!formRef.value) return

    formLoading.value = true
    try {
      const res = await OrderService.add(formData.value)
      if (res.success) {
        ElMessage.success('申请成功')
        dialogVisible.value = false
        resetForm()
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

  const stepActive = ref(0)
  function nextStep() {
    handleSubmit()
    stepActive.value++
    stepActive.value %= 3
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
