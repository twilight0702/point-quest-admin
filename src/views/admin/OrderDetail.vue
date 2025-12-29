<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { AdminOrderDetail, OrderStatus } from '../../api/types'
import { fetchOrderDetail, updateOrderStatus } from '../../api/modules/adminOrders'

const props = defineProps<{ orderNo: string }>()

const loading = ref(false)
const updating = ref(false)
const order = ref<AdminOrderDetail | null>(null)
const newStatus = ref<OrderStatus>('CREATED')

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

async function loadDetail() {
  loading.value = true
  try {
    const data = await fetchOrderDetail(props.orderNo)
    order.value = data
    newStatus.value = data.status
  } finally {
    loading.value = false
  }
}

async function handleUpdateStatus() {
  if (!order.value) return
  if (newStatus.value === order.value.status) {
    ElMessage.info('状态未变化')
    return
  }
  updating.value = true
  try {
    const data = await updateOrderStatus(order.value.orderNo, newStatus.value)
    order.value = data
    ElMessage.success('状态已更新')
  } finally {
    updating.value = false
  }
}

onMounted(loadDetail)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Order #{{ props.orderNo }}</h1>
      <el-button plain @click="$router.back()">返回</el-button>
    </div>

    <el-row :gutter="16">
      <el-col :span="16">
        <el-card shadow="never" :loading="loading">
          <template #header>订单信息</template>
          <template v-if="order">
            <div class="info">
              <div class="info-row">
                <span class="label">订单号</span>
                <span>{{ order.orderNo }}</span>
              </div>
              <div class="info-row">
                <span class="label">用户ID</span>
                <span>{{ order.userId }}</span>
              </div>
              <div class="info-row">
                <span class="label">创建时间</span>
                <span>{{ order.createdAt }}</span>
              </div>
              <div class="info-row">
                <span class="label">收货地址</span>
                <span>{{ order.address || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="label">积分总额</span>
                <span>{{ order.totalPoints }}</span>
              </div>
              <div class="info-row">
                <span class="label">状态</span>
                <el-tag :type="statusTagType[order.status]">
                  {{ statusLabel[order.status] ?? order.status }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-card>

        <el-card shadow="never" style="margin-top: 14px" :loading="loading">
          <template #header>订单项</template>
          <el-table v-if="order" :data="order.items" border size="small">
            <el-table-column prop="rewardId" label="奖品ID" width="120" />
            <el-table-column prop="rewardName" label="奖品名称" min-width="160" />
            <el-table-column prop="pointCost" label="积分消耗" width="120" />
            <el-table-column prop="quantity" label="数量" width="90" />
          </el-table>
          <div v-else class="placeholder">加载中...</div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" :loading="loading">
          <template #header>状态更新</template>
          <el-form label-position="top">
            <el-form-item label="订单状态">
              <el-select v-model="newStatus" placeholder="选择状态" style="width: 100%">
                <el-option v-for="(label, value) in statusLabel" :key="value" :label="label" :value="value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="updating" :disabled="!order" @click="handleUpdateStatus">
                更新状态
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  width: 90px;
  color: var(--el-text-color-secondary);
}

.placeholder {
  color: var(--el-text-color-secondary);
  padding: 8px 0;
}
</style>
