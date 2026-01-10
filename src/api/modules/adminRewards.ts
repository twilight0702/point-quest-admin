import { request } from '../http'
import type { PageReward, Reward, RewardCategoryList } from '../types'

export interface RewardQuery {
  status?: string
  keyword?: string
  page?: number
  size?: number
}

export interface RewardRequest {
  name: string
  description?: string
  pointCost: number
  status?: 'ON' | 'OFF'
  stock?: number
  categoryIds?: number[]
}

export function fetchRewards(params?: RewardQuery) {
  return request<PageReward>({
    url: '/api/admin/rewards',
    method: 'GET',
    params,
  })
}

export function fetchRewardDetail(rewardNo: string) {
  return request<Reward>({
    url: `/api/admin/rewards/${rewardNo}`,
    method: 'GET',
  })
}

export function createReward(payload: RewardRequest) {
  return request<Reward>({
    url: '/api/admin/rewards',
    method: 'POST',
    data: payload,
  })
}

export function updateReward(rewardNo: string, payload: RewardRequest) {
  return request<Reward>({
    url: `/api/admin/rewards/${rewardNo}`,
    method: 'PUT',
    data: payload,
  })
}

export function deleteReward(rewardNo: string) {
  return request<void>({
    url: `/api/admin/rewards/${rewardNo}`,
    method: 'DELETE',
  })
}

export function fetchRewardCategories() {
  return request<RewardCategoryList>({
    url: '/api/admin/rewards/all-category',
    method: 'GET',
  })
}

export function addRewardCategory(name: string) {
  return request<void>({
    url: '/api/admin/rewards/category',
    method: 'POST',
    data: name,
  })
}

export function updateRewardCategory(categoryId: number, name: string) {
  return request<void>({
    url: `/api/admin/rewards/category/${categoryId}`,
    method: 'PUT',
    data: name,
  })
}

export function deleteRewardCategory(categoryId: number) {
  return request<void>({
    url: `/api/admin/rewards/category/${categoryId}`,
    method: 'DELETE',
  })
}

export function uploadRewardImage(rewardNo: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request<string>({
    url: `/api/admin/rewards/${rewardNo}/image`,
    method: 'POST',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
