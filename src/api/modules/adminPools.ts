import { request } from '../http'
import type { PagePool, Pool } from '../types'

export interface PoolItemPayload {
  rewardId: number
  sortNo?: number
  weight: number
}

export interface PoolPayload {
  title: string
  description?: string
  pointCost: number
  startAt?: string
  endAt?: string
  status?: 'ON' | 'OFF'
  type?: string
  items?: PoolItemPayload[]
}

export function fetchPools(params: { status?: string; page: number; size: number }) {
  return request<PagePool>({
    url: '/api/admin/pools',
    method: 'GET',
    params,
  })
}

export function fetchPoolDetail(poolNo: string) {
  return request<Pool>({
    url: `/api/admin/pools/${poolNo}`,
    method: 'GET',
  })
}

export function createPool(payload: PoolPayload) {
  return request<Pool>({
    url: '/api/admin/pools',
    method: 'POST',
    data: payload,
  })
}

export function updatePool(poolNo: string, payload: PoolPayload) {
  return request<Pool>({
    url: `/api/admin/pools/${poolNo}`,
    method: 'PUT',
    data: payload,
  })
}

export function deletePool(poolNo: string) {
  return request<void>({
    url: `/api/admin/pools/${poolNo}`,
    method: 'DELETE',
  })
}
