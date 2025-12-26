import { request } from '../http'
import type { Paginated, TaskSubmission } from '../types'

export interface SubmissionQuery {
  status?: string
  page?: number
  pageSize?: number
}

export interface ReviewPayload {
  comment?: string
  points?: number
}

export function fetchSubmissions(params?: SubmissionQuery) {
  return request<Paginated<TaskSubmission>>({
    url: '/api/admin/submissions',
    method: 'GET',
    params,
  })
}

export function fetchSubmissionDetail(id: number) {
  return request<TaskSubmission>({
    url: `/api/admin/submissions/${id}`,
    method: 'GET',
  })
}

export function approveSubmission(id: number, payload: ReviewPayload) {
  return request<void>({
    url: `/api/admin/submissions/${id}/approve`,
    method: 'POST',
    data: payload,
  })
}

export function rejectSubmission(id: number, payload: ReviewPayload) {
  return request<void>({
    url: `/api/admin/submissions/${id}/reject`,
    method: 'POST',
    data: payload,
  })
}
