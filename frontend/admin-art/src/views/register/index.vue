<template>
  <div class="login register">
    <div class="left-wrap">
      <left-view></left-view>
    </div>
    <div class="right-wrap">
      <div class="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconsys-zhaopian-copy"></use>
        </svg>
        <h1>{{ systemName }}</h1>
      </div>
      <div class="login-wrap">
        <div class="form">
          <h3 class="title">{{ $t('register.title') }}</h3>
          <p class="sub-title">{{ $t('register.subTitle') }}</p>
          <el-form ref="formRef" :model="formData" status-icon :rules="rules" label-position="top">
            <el-form-item prop="username">
              <el-input v-model.trim="formData.username" :placeholder="$t('register.username[0]')" size="large" />
            </el-form-item>
            <el-form-item prop="email">
              <el-input v-model.trim="formData.email" :placeholder="$t('register.email[0]')" size="large" />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model.trim="formData.password"
                :placeholder="$t('register.password[0]')"
                size="large"
                type="password"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model.trim="formData.confirmPassword"
                :placeholder="$t('register.confirmPassword[0]')"
                size="large"
                type="password"
                autocomplete="off"
                @keyup.enter="register"
              />
            </el-form-item>

            <el-form-item prop="agreement">
              <el-checkbox v-model="formData.agreement">
                {{ $t('register.agreeText') }}
                <router-link style="color: var(--main-color); text-decoration: none" to="/privacy-policy">
                  {{ $t('register.privacyPolicy') }}
                </router-link>
              </el-checkbox>
            </el-form-item>

            <div style="margin-top: 15px">
              <el-button class="register-btn" size="large" type="primary" @click="register" :loading="loading" v-ripple>
                {{ $t('register.submitBtnText') }}
              </el-button>
            </div>

            <div class="footer">
              <p>
                {{ $t('register.hasAccount') }}
                <router-link to="/login">{{ $t('register.toLogin') }}</router-link>
              </p>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { AuthService, type SignupBody } from '@/api'
  import LeftView from '@/components/Pages/Login/LeftView.vue'
  import { SystemInfo } from '@/config/setting'
  import { useUserStore } from '@/store/modules/user'

  const { t } = useI18n()
  const userStore = useUserStore()
  const router = useRouter()

  const formRef = ref<FormInstance>()

  const systemName = SystemInfo.name
  const loading = ref(false)

  const formData = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreement: false
  })

  const validateUsername = (rule: any, value: string, callback: any) => {
    AuthService.checkRepeat({ username: value })
      .then((res) => {
        if (res.success) {
          callback()
        } else {
          callback(t('register.username[2]'))
        }
      })
      .catch(() => {
        callback(t('register.username[2]'))
      })
  }

  const validatePass = (rule: any, value: string, callback: any) => {
    if (formData.confirmPassword !== '') {
      formRef.value?.validateField('confirmPassword')
    }
    callback()
  }

  const validatePass2 = (rule: any, value: string, callback: any) => {
    if (value !== formData.password) {
      callback(new Error(t('register.confirmPassword[1]')))
    } else {
      callback()
    }
  }

  const rules = reactive<FormRules>({
    username: [
      { required: true, message: t('register.username[0]'), trigger: 'blur' },
      { min: 5, max: 20, message: t('register.username[1]'), trigger: 'blur' },
      { required: true, validator: validateUsername, trigger: 'blur' }
    ],
    email: [
      { required: true, message: t('register.email[0]'), trigger: 'blur' },
      { type: 'email', message: t('register.email[1]'), trigger: 'blur' }
    ],
    password: [
      { required: true, message: t('register.password[0]'), trigger: 'blur' },
      { min: 6, message: t('register.password[1]'), trigger: 'blur' },
      { validator: validatePass, trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: t('register.password[0]'), trigger: 'blur' },
      { validator: validatePass2, trigger: 'blur' }
    ],
    agreement: [{ required: true, message: t('register.agreement[0]'), trigger: 'change' }]
  })

  /** 注册 */
  async function register() {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      loading.value = true

      const data: SignupBody = {
        username: formData.username,
        password: formData.password
      }

      const res = await AuthService.signup(data)
      if (res.success) {
        ElMessage.success(t('register.success'))
        userStore.setLogin({ username: formData.username, password: formData.password })
        router.push('/login')
      }
    } catch (error) {
      console.log('验证失败', error)
    } finally {
      loading.value = false
    }
  }
</script>

<style lang="scss" scoped>
  @use '../login/index' as login;
  @use './index' as register;
</style>
