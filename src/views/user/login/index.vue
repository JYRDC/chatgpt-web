<script lang="ts" setup>
import { NButton, NCard, NInput, useMessage, useNotification } from 'naive-ui'
import { ref } from 'vue'
import { isNotEmptyString } from '@/utils/is'
import { useAuthStoreWithout } from '@/store/modules/auth'
import { setToken } from '@/store/modules/auth/helper'
import { useUserStore } from '@/store'

const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
const authStore = useAuthStoreWithout()
const userStore = useUserStore()
const message = useMessage()
const notification = useNotification()

const isLogin = ref(true)
const formInfo = ref({ email: '', password: '', verCode: '' })

async function submit() {
  if (!isNotEmptyString(formInfo.value.email) || !isNotEmptyString(formInfo.value.password)) {
    message.warning('账号或密码不能为空')
    return
  }
  if (!regEmail.test(formInfo.value.email)) {
    message.warning('请输入正确的邮箱')
    return
  }
  try {
    let data: any = {}
    if (isLogin.value) {
      data = await authStore.login(formInfo.value)
    }
    else {
      if (!isNotEmptyString(formInfo.value.verCode)) {
        message.warning('验证码不能为空')
        return
      }
      data = await authStore.register(formInfo.value)
    }
    setToken(data.token)
    userStore.updateUserInfo(data)
    window.location.reload()
  }
  catch (error: any) {
    message.error(error.message)
  }
}
</script>

<template>
  <div class="login-content">
    <NCard hoverable style="width: 90%;" header-style="text-align: center;">
      <template #header>
        <p style="font-weight: bold; font-size: 22px">
          "登 录"
        </p>
      </template>
      <div class="p-4 space-y-5 min-h-[150px]">
        <div class="space-y-6">
          <div class="flex items-center space-x-4">
            <span class="flex-shrink-0 w-[42px]">邮 箱</span>
            <div class="flex-1">
              <NInput v-model:value="formInfo.email" placeholder="" />
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="flex-shrink-0 w-[42px]">密 码</span>
            <div class="flex-1">
              <NInput v-model:value="formInfo.password" type="password" placeholder="" />
            </div>
          </div>
        </div>
      </div>
      <div class="logio-option">
        <NButton type="info" @click="submit">
          登 录
        </NButton>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.login-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%; /* 设置宽度，可以根据实际情况调整 */
  max-width: 500px; /* 设置最大宽度，可以根据实际情况调整 */
  height: auto; /* 设置高度自适应，根据内容自动调整 */
  display: flex;
  justify-content: center;
}
.logio-option {
  display: flex;
  justify-content: space-around;
}
</style>
