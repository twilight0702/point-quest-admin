<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { AdminOrderSummary, OrderStatus } from '../../api/types'
import { fetchOrders } from '../../api/modules/adminOrders'

const router = useRouter()

const filters = reactive({
  status: '' as OrderStatus | '',
  userId: '',
})
const orders = ref<AdminOrderSummary[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

const statusLabel: Record<OrderStatus, string> = {
  CREATED: '已创建',
  PROCESSING: '处理中',
  SHIPPED: '已发货',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
}

const statusTagType: Record<OrderStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  CREATED: 'info',
  PROCESSING: 'warning',
  SHIPPED: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'danger',
}

async function loadOrders() {
  loading.value = true
  const userIdParam = filters.userId.trim() ? Number(filters.userId) : undefined
  if (userIdParam !== undefined && Number.isNaN(userIdParam)) {
    ElMessage.warning('请输入有效的用户ID')
    loading.value = false
    return
  }
  try {
    const data = await fetchOrders({
      page: pagination.page,
      size: pagination.size,
      status: filters.status || undefined,
      userId: userIdParam,
    })
    orders.value = data.records || []
    pagination.page = data.current ?? pagination.page
    pagination.size = data.size ?? pagination.size
    pagination.total = data.total ?? 0
  } catch (error) {
    orders.value = []
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  loadOrders()
}

function handlePageChange(page: number) {
  pagination.page = page
  loadOrders()
}

function handleSizeChange(size: number) {
  pagination.size = size
  pagination.page = 1
  loadOrders()
}

function viewDetail(orderNo: string) {
  router.push(`/admin/orders/${orderNo}`)
}

onMounted(loadOrders)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Orders</h1>
      <el-button type="primary" plain size="small" @click="loadOrders">刷新</el-button>
    </div>

    <el-card shadow="never">
      <div class="filter-bar">
        <el-select v-model="filters.status" placeholder="状态" clearable size="small" style="width: 160px">
          <el-option v-for="(label, value) in statusLabel" :key="value" :label="label" :value="value" />
        </el-select>
        <el-input
          v-model="filters.userId"
          placeholder="用户ID"
          clearable
          size="small"
          style="width: 180px"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" plain size="small" @click="handleSearch">查询</el-button>
      </div>

      <el-table :data="orders" border :loading="loading">
        <el-table-column prop="orderNo" label="订单号" min-width="200" />
        <el-table-column prop="userId" label="用户ID" width="120" />
        <el-table-column prop="itemCount" label="商品数" width="100" />
        <el-table-column prop="totalPoints" label="积分消耗" width="110" />
        <el-table-column prop="createdAt" label="创建时间" min-width="170" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag :type="statusTagType[scope.row.status]">
              {{ statusLabel[scope.row.status] ?? scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row.orderNo)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="pagination.page"
          :page-size="pagination.size"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
