import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { fetchProfile, login as loginApi, logout as logoutApi } from '../api/modules/auth'
import type { AdminProfile } from '../api/types'
import type { LoginPayload } from '../api/modules/auth'

export const useAdminAuthStore = defineStore('adminAuth', {
  state: () => ({
    me: null as AdminProfile | null,
    loading: false,
    checking: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.me,
  },
  actions: {
    async ensureProfile() {
      if (this.me || this.checking) return
      this.checking = true
      try {
        this.me = await fetchProfile()
      } catch (error) {
        this.me = null
      } finally {
        this.checking = false
      }
    },
    async login(payload: LoginPayload) {
      this.loading = true
      try {
        this.me = await loginApi(payload)
        ElMessage.success('登录成功')
      } finally {
        this.loading = false
      }
    },
    async logout() {
      try {
        await logoutApi()
      } finally {
        this.me = null
      }
    },
  },
})
