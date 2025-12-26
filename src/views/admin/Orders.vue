<script setup lang="ts">
import { ref } from 'vue'

const orders = ref([
  {
    orderNo: 'PQ20241226001',
    user: 'alice',
    totalPoints: 500,
    createdAt: '2024-12-26 10:00',
    status: 'PAID',
  },
  {
    orderNo: 'PQ20241226002',
    user: 'bob',
    totalPoints: 320,
    createdAt: '2024-12-26 10:10',
    status: 'PAID',
  },
  {
    orderNo: 'PQ20241225001',
    user: 'chris',
    totalPoints: 200,
    createdAt: '2024-12-25 08:00',
    status: 'CANCELED',
  },
])
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Orders</h1>
      <el-button type="primary" plain size="small">刷新</el-button>
    </div>

    <el-card shadow="never">
      <el-table :data="orders" border>
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
        <el-table-column prop="user" label="用户" width="120" />
        <el-table-column prop="totalPoints" label="积分消耗" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'PAID' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default>
            <el-button link type="primary">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
