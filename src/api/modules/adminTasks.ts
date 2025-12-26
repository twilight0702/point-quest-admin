import { request } from '../http'
import type { Paginated, Task } from '../types'

export interface TaskQuery {
  status?: string
  keyword?: string
  page?: number
  pageSize?: number
}

export interface TaskPayload {
  title: string
  description?: string
  pointReward: number
  deadline?: string
  status?: 'OPEN' | 'CLOSED'
}

export function fetchTasks(params?: TaskQuery) {
  return request<Paginated<Task>>({
    url: '/api/admin/tasks',
    method: 'GET',
    params,
  })
}

export function fetchTaskDetail(id: number) {
  return request<Task>({
    url: `/api/admin/tasks/${id}`,
    method: 'GET',
  })
}

export function createTask(payload: TaskPayload) {
  return request<Task>({
    url: '/api/admin/tasks',
    method: 'POST',
    data: payload,
  })
}

export function updateTask(id: number, payload: TaskPayload) {
  return request<Task>({
    url: `/api/admin/tasks/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export function closeTask(id: number) {
  return request<void>({
    url: `/api/admin/tasks/${id}/close`,
    method: 'POST',
  })
}
