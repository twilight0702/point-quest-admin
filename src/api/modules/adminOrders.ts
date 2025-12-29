import { request } from '../http'
import type { AdminOrderDetail, AdminOrderSummary, OrderStatus, PageAdminOrderSummary } from '../types'

export interface OrderQuery {
  userId?: number
  page?: number
  size?: number
  status?: OrderStatus
}

export function fetchOrders(params?: OrderQuery) {
  return request<PageAdminOrderSummary>({
    url: '/api/admin/orders',
    method: 'GET',
    params,
  })
}

export function fetchOrderDetail(orderNo: string) {
  return request<AdminOrderDetail>({
    url: `/api/admin/orders/${orderNo}`,
    method: 'GET',
  })
}

export function updateOrderStatus(orderNo: string, status: OrderStatus) {
  return request<AdminOrderDetail>({
    url: `/api/admin/orders/${orderNo}/status`,
    method: 'PUT',
    data: { status },
  })
}
