import { request } from '../http'
import type { Order, Paginated } from '../types'

export interface OrderQuery {
  userId?: number
  page?: number
  pageSize?: number
}

export function fetchOrders(params?: OrderQuery) {
  return request<Paginated<Order>>({
    url: '/api/admin/orders',
    method: 'GET',
    params,
  })
}

export function fetchOrderDetail(orderNo: string) {
  return request<Order>({
    url: `/api/admin/orders/${orderNo}`,
    method: 'GET',
  })
}
