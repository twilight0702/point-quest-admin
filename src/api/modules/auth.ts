import { request } from '../http'
import type { AdminProfile } from '../types'

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user?: AdminProfile
}

export function login(payload: LoginPayload) {
  return request<AuthResponse>({
    url: '/api/auth/admin/login',
    method: 'POST',
    data: payload,
  })
}

export function logout() {
  return request<void>({
    url: '/api/auth/logout',
    method: 'POST',
  })
}
