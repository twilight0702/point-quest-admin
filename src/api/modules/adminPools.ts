import { request } from '../http'
import type { Paginated, Pool, PoolItem, Reward } from '../types'

export interface PoolPayload {
  name: string
  status?: 'ON' | 'OFF'
  startAt?: string
  endAt?: string
  rewardIds?: number[]
}

export interface PoolItemsPayload {
  items: PoolItem[]
}

export function fetchPools(params?: { status?: string; page?: number; pageSize?: number }) {
  return request<Paginated<Pool>>({
    url: '/api/admin/pools',
    method: 'GET',
    params,
  })
}

export function fetchPoolDetail(id: number) {
  return request<Pool & { rewards?: Reward[]; items?: PoolItem[] }>({
    url: `/api/admin/pools/${id}`,
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

export function updatePool(id: number, payload: PoolPayload) {
  return request<Pool>({
    url: `/api/admin/pools/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export function updatePoolItems(id: number, payload: PoolItemsPayload) {
  return request<void>({
    url: `/api/admin/pools/${id}/items`,
    method: 'PUT',
    data: payload,
  })
}
