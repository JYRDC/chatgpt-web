<script setup lang='ts'>
import { ref } from 'vue'
import { NSpin } from 'naive-ui'

const loading = ref(true)
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4">
      <h2 class="text-xl font-bold">
        本站点将于2023年07月01日00:00关闭服务
      </h2>
      <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
        <p>
          新站点地址：
          <a
            class="text-blue-600 dark:text-blue-500"
            href="https://aichat.jingyan.live/"
            target="_blank"
          >
            JY-AIChat（点击跳转）
          </a>
          ，老用户迁移赠送5元额度（新用户2元，5元 = 200000token ≈ 100000中文）。
        </p>
        <p>
          新站点新功能如下：<br>
          1. GPT4.0<br>
          2. 搭建个人知识库（AI只回答你的知识库内容）<br>
          3. 支持公开个人知识库及使用他人公开的知识库<br>
          4. 聊天基于应用，支持公开应用（他人无需登录即可使用你的AI助手）<br>
          5. 邀请好友，好友充值返利机制（可提现！）<br>
        </p>
        <p>
          迁移教程（仅当前网站用户）：<br>
          1. 进入新站点，点击开始 进入登录页<br>
          2. 点击 忘记密码 （新站使用新加密方式，所以需要老用户找回密码）<br>
          3. 输入邮箱、新密码并点击获取验证码，输入验证码后点击 找回密码，即可完成密码重置 <br>
        </p>
      </div>
    </div>
  </NSpin>
</template>
