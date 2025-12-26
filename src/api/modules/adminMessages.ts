import { request } from '../http'
import type { MessagePayload } from '../types'

export function sendMessage(payload: MessagePayload) {
  return request<void>({
    url: '/api/admin/messages/send',
    method: 'POST',
    data: payload,
  })
}
