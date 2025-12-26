import { request } from '../http'
import type { Paginated, Reward } from '../types'

export interface RewardQuery {
  status?: string
  keyword?: string
  page?: number
  pageSize?: number
}

export interface RewardPayload {
  name: string
  code?: string
  description?: string
  pointCost: number
  category?: string
  status?: 'ON' | 'OFF'
  stock?: number
}

export interface StockPayload {
  delta: number
}

export function fetchRewards(params?: RewardQuery) {
  return request<Paginated<Reward>>({
    url: '/api/admin/rewards',
    method: 'GET',
    params,
  })
}

export function fetchRewardDetail(id: number) {
  return request<Reward>({
    url: `/api/admin/rewards/${id}`,
    method: 'GET',
  })
}

export function createReward(payload: RewardPayload) {
  return request<Reward>({
    url: '/api/admin/rewards',
    method: 'POST',
    data: payload,
  })
}

export function updateReward(id: number, payload: RewardPayload) {
  return request<Reward>({
    url: `/api/admin/rewards/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export function adjustStock(id: number, payload: StockPayload) {
  return request<void>({
    url: `/api/admin/rewards/${id}/stock`,
    method: 'POST',
    data: payload,
  })
}

export function toggleReward(id: number, on: boolean) {
  return request<void>({
    url: `/api/admin/rewards/${id}/${on ? 'on' : 'off'}`,
    method: 'POST',
  })
}
