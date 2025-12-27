import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { login as loginApi, logout as logoutApi } from '../api/modules/auth'
import type { AdminProfile } from '../api/types'
import type { LoginPayload } from '../api/modules/auth'
import {
  clearToken,
  clearUser,
  getValidToken,
  isTokenExpired,
  persistToken,
  persistUser,
  readUser,
} from '../utils/authToken'

export const useAdminAuthStore = defineStore('adminAuth', {
  state: () => ({
    me: readUser<AdminProfile>() as AdminProfile | null,
    token: getValidToken() as string | null,
    loading: false,
    checking: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async ensureSession() {
      if (this.checking) return
      this.checking = true

      const storedToken = getValidToken()
      if (!storedToken || isTokenExpired(storedToken)) {
        this.clearSession()
        this.checking = false
        return
      }

      this.token = storedToken
      const cachedUser = readUser<AdminProfile>()
      if (cachedUser) {
        this.me = cachedUser
      }

      this.checking = false
    },
    async login(payload: LoginPayload) {
      this.loading = true
      try {
        const auth = await loginApi(payload)
        if (auth.token) {
          this.setToken(auth.token)
        }
        if (auth.user) {
          this.setUser(auth.user)
        }
        ElMessage.success('登录成功')
      } finally {
        this.loading = false
      }
    },
    async logout() {
      try {
        await logoutApi()
      } finally {
        this.clearSession()
      }
    },
    setToken(token: string) {
      this.token = token
      persistToken(token)
    },
    setUser(user: AdminProfile) {
      this.me = user
      persistUser(user)
    },
    clearSession() {
      this.me = null
      this.token = null
      clearToken()
      clearUser()
    },
  },
})
