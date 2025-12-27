export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface Paginated<T> {
  list: T[]
  page: number
  pageSize: number
  total: number
}

export interface AdminProfile {
  id: number
  username: string
  role: 'ADMIN'
}

export type TaskStatus = 'OPEN' | 'CLOSED' | 'ENDED'

export interface Task {
  id: number
  taskNo: string
  title: string
  description?: string
  pointReward: number
  deadline?: string
  status: TaskStatus
  createdBy?: number
  createdUserType?: string
  createdAt?: string
  updatedAt?: string
  isDel?: number
}

export interface PageTask {
  records: Task[]
  total: number
  size: number
  current: number
  orders?: Array<{ column: string; asc: boolean }>
  optimizeCountSql?: boolean
  searchCount?: boolean
  optimizeJoinOfCountSql?: boolean
  maxLimit?: number
  countId?: string
}

export interface TaskSubmission {
  id: number
  taskId: number
  userId: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  submittedAt?: string
  evidenceUrl?: string
  comment?: string
}

export interface Reward {
  id: number
  name: string
  code?: string
  description?: string
  pointCost: number
  category?: string
  status: 'ON' | 'OFF'
  stock?: number
}

export interface Pool {
  id: number
  name: string
  status: 'ON' | 'OFF'
  startAt?: string
  endAt?: string
}

export interface PoolItem {
  rewardId: number
  sortNo: number
}

export interface MessagePayload {
  title: string
  content: string
  receiverIds?: number[]
  broadcast?: boolean
}

export interface Order {
  orderNo: string
  userId: number
  totalPoints: number
  createdAt: string
  status: string
}
