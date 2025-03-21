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
          <h3 class="title">{{ $t('forgetPassword.title') }}</h3>
          <p class="sub-title">{{ $t('forgetPassword.subTitle') }}</p>
          <div v-if="resetPasswordToken" class="input-wrap">
            <el-input :placeholder="$t('forgetPassword.applyPlaceholder')" size="large" v-model.trim="password" />
          </div>
          <div v-else class="input-wrap">
            <el-input :placeholder="$t('forgetPassword.resetPlaceholder')" size="large" v-model.trim="email" />
          </div>

          <div style="margin-top: 15px">
            <el-button
              class="login-btn"
              size="large"
              type="primary"
              :disabled="resetPasswordToken ? validatePassword(password) : validateEmail(email)"
              @click="submit"
              :loading="loading"
              v-ripple
            >
              {{ $t(resetPasswordToken ? 'forgetPassword.submitResetBtnText' : 'forgetPassword.submitApplyBtnText') }}
            </el-button>
          </div>

          <div style="margin-top: 15px">
            <el-button style="width: 100%; height: 46px" size="large" plain @click="toLogin">
              {{ $t('forgetPassword.backBtnText') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { AuthService } from '@/api'
  import { SystemInfo } from '@/config/setting'
  import LeftView from '@/components/Pages/Login/LeftView.vue'
  const router = useRouter()

  const systemName = SystemInfo.name
  const email = ref('')
  const username = ref('')
  const password = ref('')
  const loading = ref(false)
  let resetPasswordToken = ref('')

  // 验证邮箱
  const validateEmail = (value: string) => {
    //  格式
    const reg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return !reg.test(value)
  }

  // 验证密码
  const validatePassword = (value: string) => {
    //  格式 大于6位就可以了
    const reg = /^.{6,}$/

    return !reg.test(value)
  }

  function applyReset() {
    if (!email.value) {
      ElMessage.error('请输入邮箱')
      return
    }
    loading.value = true

    AuthService.applyResetPassword({ email: email.value })
      .then((res) => {
        if (res.success) {
          username.value = res.data.username
          resetPasswordToken.value = res.data.token
          ElMessage.success('发送成功')
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  function resetPassword() {
    if (!password.value) {
      ElMessage.error('请输入密码')
      return
    }
    AuthService.resetPassword({
      username: username.value,
      token: resetPasswordToken.value,
      password: password.value
    }).then(() => {
      ElMessage.success('修改成功')
      router.push('/login')
    })
  }

  function submit() {
    if (resetPasswordToken.value) {
      resetPassword()
    } else {
      applyReset()
    }
  }

  const toLogin = () => {
    router.push('/login')
  }
</script>

<style lang="scss" scoped>
  @use '../login/index';
</style>
