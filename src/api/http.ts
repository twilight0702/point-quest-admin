import axios, { AxiosError } from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse } from './types'

export class ApiError extends Error {
  code?: number
  status?: number

  constructor(message: string, options?: { code?: number; status?: number }) {
    super(message)
    this.name = 'ApiError'
    this.code = options?.code
    this.status = options?.status
  }
}

const SUCCESS_CODES = new Set([0, 200])

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
  withCredentials: true,
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config
})

http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => response,
  (error: AxiosError<ApiResponse<unknown>>) => handleHttpError(error),
)

function normalizeResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  const payload = response.data
  if (payload && typeof payload.code === 'number') {
    if (SUCCESS_CODES.has(payload.code)) {
      return payload.data as T
    }
    const message = payload.message || '请求失败'
    ElMessage.error(message)
    throw new ApiError(message, { code: payload.code, status: response.status })
  }

  // Fallback for non-standard responses
  return (response.data as unknown as T) ?? ({} as T)
}

function handleHttpError(error: AxiosError<ApiResponse<unknown>>): never {
  const status = error.response?.status
  const payload = error.response?.data
  const message =
    payload?.message ||
    (status === 401
      ? '请先登录'
      : status === 403
        ? '没有权限执行该操作'
        : status === 422
          ? '请求参数有误'
          : '网络异常，请稍后再试')

  ElMessage.error(message)
  throw new ApiError(message, { code: payload?.code, status })
}

export async function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  const response = await http.request<ApiResponse<T>>(config)
  return normalizeResponse(response)
}

export { http }
