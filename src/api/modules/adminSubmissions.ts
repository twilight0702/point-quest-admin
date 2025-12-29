import { request } from '../http'
import type { AdminSubmission, AdminSubmissionDetail, PageAdminSubmission } from '../types'

export interface SubmissionQuery {
  page: number
  size: number
  status?: string
}

export interface ApproveSubmissionPayload {
  pointsAwarded?: number
  comment?: string
}

export interface RejectSubmissionPayload {
  comment: string
}

export function fetchSubmissions(params: SubmissionQuery) {
  return request<PageAdminSubmission>({
    url: '/api/admin/submissions',
    method: 'GET',
    params,
  })
}

export function fetchSubmissionDetail(submissionNo: string) {
  return request<AdminSubmissionDetail>({
    url: `/api/admin/submissions/${submissionNo}`,
    method: 'GET',
  })
}

export function approveSubmission(submissionNo: string, payload: ApproveSubmissionPayload) {
  return request<void>({
    url: `/api/admin/submissions/${submissionNo}/approve`,
    method: 'POST',
    data: payload,
  })
}

export function rejectSubmission(submissionNo: string, payload: RejectSubmissionPayload) {
  return request<void>({
    url: `/api/admin/submissions/${submissionNo}/reject`,
    method: 'POST',
    data: payload,
  })
}
