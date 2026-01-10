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

export interface AdminSubmission {
  submissionNo: string
  taskNo: string
  taskTitle: string
  username: string
  userEmail: string
  pointReward: number
  status: string
  evidenceText?: string
  createdAt: string
}

export interface AdminSubmissionDetail extends AdminSubmission {
  userId: number
  evidencePreviewUrls: string[]
  pointsAwarded?: number
  reviewComment?: string
}

export interface PageAdminSubmission {
  records: AdminSubmission[]
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

export interface Reward {
  id: number
  rewardNo: string
  name: string
  description?: string
  pointCost: number
  status: 'ON' | 'OFF'
  stock?: number
  imageUrls?: string[]
  categoryIds?: number[]
  categoryNames?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface RewardCategory {
  id: number
  name: string
}

export interface Pool {
  id: number
  poolNo: string
  title: string
  description?: string
  pointCost: number
  startAt?: string
  endAt?: string
  status: 'ON' | 'OFF'
  type?: string
  createdAt?: string
  updatedAt?: string
  items?: PoolItem[]
}

export interface PoolItem {
  rewardId: number
  rewardName?: string
  rewardNo?: string
  pointCost?: number
  rewardStatus?: string
  sortNo?: number
  weight?: number
}

export interface PagePool {
  records: Pool[]
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

export interface MessagePayload {
  title: string
  content: string
  receiverIds?: number[]
  broadcast?: boolean
}

export type OrderStatus = 'CREATED' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'

export interface AdminOrderSummary {
  orderNo: string
  userId: number
  totalPoints: number
  createdAt: string
  status: OrderStatus
  itemCount: number
}

export interface OrderItem {
  rewardId: number
  rewardName: string
  pointCost: number
  quantity: number
}

export interface AdminOrderDetail extends AdminOrderSummary {
  address: string
  items: OrderItem[]
}

export interface PageAdminOrderSummary {
  records: AdminOrderSummary[]
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

export interface PageReward {
  records: Reward[]
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

export interface RewardCategoryList {
  categories: RewardCategory[]
}
