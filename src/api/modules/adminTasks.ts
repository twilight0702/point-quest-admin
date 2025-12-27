import { request } from '../http'
import type { PageTask, Task, TaskStatus } from '../types'

export interface TaskQuery {
  page: number
  size: number
  status?: TaskStatus | ''
}

export interface TaskPayload {
  title: string
  description?: string
  pointReward: number
  deadline?: string
  status?: TaskStatus
}

export function fetchTasks(params: TaskQuery) {
  return request<PageTask>({
    url: '/api/admin/tasks',
    method: 'GET',
    params,
  })
}

export function fetchTaskDetail(taskNo: string) {
  return request<Task>({
    url: `/api/admin/tasks/${taskNo}`,
    method: 'GET',
  })
}

export function createTask(payload: TaskPayload) {
  return request<void>({
    url: '/api/admin/tasks',
    method: 'POST',
    data: payload,
  })
}

export function updateTask(taskNo: string, payload: TaskPayload) {
  return request<Task>({
    url: `/api/admin/tasks/${taskNo}`,
    method: 'PUT',
    data: payload,
  })
}

export function deleteTask(taskNo: string) {
  return request<void>({
    url: `/api/admin/tasks/${taskNo}`,
    method: 'DELETE',
  })
}
