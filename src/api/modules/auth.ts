import { request } from '../http'
import type { AdminProfile } from '../types'

export interface LoginPayload {
  username: string
  password: string
}

export function login(payload: LoginPayload) {
  return request<AdminProfile>({
    url: '/api/auth/login',
    method: 'POST',
    data: payload,
  })
}

export function fetchProfile() {
  return request<AdminProfile>({
    url: '/api/auth/me',
    method: 'GET',
  })
}

export function logout() {
  return request<void>({
    url: '/api/auth/logout',
    method: 'POST',
  })
}
