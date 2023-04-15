<script lang="ts" setup>
import { NButton, NCard, NInput, useMessage, useNotification } from 'naive-ui'
// import { useRouter } from 'vue-router'
import { h, ref } from 'vue'
import countDown from '@/utils/countDown'
import { isNotEmptyString } from '@/utils/is'
import { useAuthStoreWithout } from '@/store/modules/auth'
import { setToken } from '@/store/modules/auth/helper'
import { fetchVerCode } from '@/api'
import { useUserStore } from '@/store'
import { getCurrentDate } from '@/utils/functions'

const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
// const router = useRouter()
const authStore = useAuthStoreWithout()
const userStore = useUserStore()
const message = useMessage()
const notification = useNotification()

const { state: countDownState, start: startTimeout } = countDown(60)

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

async function getVerCode() {
  if (!regEmail.test(formInfo.value.email)) {
    message.warning('请输入正确的邮箱')
    return
  }
  try {
    const res: any = await fetchVerCode(formInfo.value.email)
    if (res.code === 200) {
      startTimeout()
      handleNotify()
      // message.success(res.message)
    }
  }
  catch (error: any) {
    message.error(error.message)
  }
}

function handleNotify() {
  let markAsRead = false
  const n = notification.create({
    title: '验证码已发送',
    content: '部分邮箱（outlook）收不到验证码可能是因为被标记为垃圾邮件，到垃圾箱中可以看到验证码。如还有问题可联系管理员QQ：1329208516。',
    closable: false,
    meta: `${getCurrentDate()} `,
    type: 'success',
    action: () =>
      h(
        NButton,
        {
          text: true,
          type: 'primary',
          onClick: () => {
            markAsRead = true
            n.destroy()
          },
        },
        {
          default: () => '已读',
        },
      ),
  })
}
</script>

<template>
  <div class="login-content">
    <NCard hoverable style="width: 90%;" header-style="text-align: center;">
      <template #header>
        <p style="font-weight: bold; font-size: 22px">
          {{ isLogin ? "登 录" : "注 册" }}
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
          <div v-if="!isLogin" class="flex items-center space-x-4">
            <span class="flex-shrink-0 w-[42px]">验证码</span>
            <div class="w-[100px]">
              <NInput v-model:value="formInfo.verCode" placeholder="" />
            </div>
            <div class="w-[100px]">
              <NButton quaternary @click="getVerCode">
                {{ countDownState.count === 0 ? "获取验证码" : countDownState.count }}
              </NButton>
            </div>
          </div>
        </div>
      </div>
      <div class="logio-option">
        <NButton v-if="!isLogin" @click="isLogin = !isLogin">
          登 录
        </NButton>
        <NButton v-if="!isLogin" type="info" @click="submit">
          注 册
        </NButton>
        <NButton v-if="isLogin" @click="isLogin = !isLogin">
          注 册
        </NButton>
        <NButton v-if="isLogin" type="info" @click="submit">
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
