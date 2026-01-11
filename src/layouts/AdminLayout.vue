<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  House,
  List,
  EditPen,
  Coin,
  CollectionTag,
  Message,
  Tickets,
} from '@element-plus/icons-vue'
import { useAdminAuthStore } from '../stores/adminAuth'

const route = useRoute()
const router = useRouter()
const authStore = useAdminAuthStore()

const navItems = [
  { label: '概览', path: '/admin', icon: House },
  { label: '任务', path: '/admin/tasks', icon: List },
  { label: '提交', path: '/admin/submissions', icon: EditPen },
  { label: '奖品', path: '/admin/rewards', icon: Coin },
  { label: '奖池', path: '/admin/pools', icon: CollectionTag },
  { label: '订单', path: '/admin/orders', icon: Tickets },
]

const activeMenu = computed(() => {
  if (route.path.startsWith('/admin/tasks')) return '/admin/tasks'
  if (route.path.startsWith('/admin/submissions')) return '/admin/submissions'
  if (route.path.startsWith('/admin/rewards')) return '/admin/rewards'
  if (route.path.startsWith('/admin/pools')) return '/admin/pools'
  if (route.path.startsWith('/admin/messages')) return '/admin/messages/send'
  if (route.path.startsWith('/admin/orders')) return '/admin/orders'
  return '/admin'
})

async function handleLogout() {
  const confirmed = await ElMessageBox.confirm('确认退出管理后台吗？', '提示', {
    confirmButtonText: '退出登录',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch(() => false)

  if (!confirmed) return
  await authStore.logout()
  router.push('/admin/login')
}
</script>

<template>
  <el-container class="admin-shell">
    <el-aside width="220px" class="aside">
      <div class="brand">
        <span class="dot"></span>
        <div>
          <div class="brand-title">积分奇旅</div>
          <div class="brand-subtitle">积分管理后台</div>
        </div>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        :ellipsis="false"
        class="nav-menu"
        background-color="#0ea5e9"
        text-color="#e0f2fe"
        active-text-color="#fff"
      >
        <el-menu-item v-for="item in navItems" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="breadcrumbs">
          <h1>管理后台</h1>
          <p class="muted">统一管理任务、奖品、活动池和订单</p>
        </div>
        <div class="header-actions">
          <span class="user-chip">{{ authStore.me?.username ?? '管理员' }}</span>
          <el-button size="small" type="primary" plain @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: var(--color-surface);
  padding: 12px;
}

.aside {
  background: #38a5dbff;
  color: #e0f2fe;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.1);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
}

.brand-title {
  font-weight: 700;
  letter-spacing: 0.2px;
}

.brand-subtitle {
  font-size: 12px;
  opacity: 0.8;
}

.nav-menu {
  border: none;
  background: transparent;
}

:global(.el-menu-item) {
  border-radius: 10px;
}

:global(.el-menu-item:hover) {
  background: #2478a1ff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid var(--color-border);
  padding: 26px 28px;
  min-height: 96px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.breadcrumbs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.breadcrumbs h1 {
  margin: 0;
  font-size: 18px;
  line-height: 1.3;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-chip {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 13px;
}

.main {
  padding: 28px 28px 32px;
  background: var(--color-surface);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}
</style>
