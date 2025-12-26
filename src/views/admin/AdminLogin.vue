<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { useAdminAuthStore } from '../../stores/adminAuth'

const formRef = ref<FormInstance>()
const route = useRoute()
const router = useRouter()
const authStore = useAdminAuthStore()

const form = reactive({
  username: '',
  password: '',
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const onSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    await authStore.login(form)
    const redirect = (route.query.redirect as string) || '/admin'
    router.push(redirect)
  })
}
</script>

<template>
  <div class="login-shell">
    <div class="login-card">
      <div class="logo">
        <span class="dot"></span>
        <div>
          <div class="title">PointQuest</div>
          <div class="subtitle">管理员登录</div>
        </div>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="输入管理员账号" autocomplete="username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="输入密码"
            autocomplete="current-password"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="authStore.loading"
            style="width: 100%"
            @click="onSubmit"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <p class="muted">登录后将跳转到 Dashboard，未登录访问管理页会自动重定向</p>
    </div>
  </div>
</template>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f2fe, #f8fafc);
  padding: 20px;
}

.login-card {
  width: 380px;
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 12px 50px rgba(37, 99, 235, 0.1);
  border: 1px solid var(--color-border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.15);
}

.title {
  font-weight: 700;
}

.subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
