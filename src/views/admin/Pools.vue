<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const pools = ref([
  { id: 1, name: '春节兑换池', status: 'ON', startAt: '2024-12-28', endAt: '2025-01-05' },
  { id: 2, name: '常驻精选', status: 'OFF', startAt: '-', endAt: '-' },
])

function goNew() {
  router.push('/admin/pools/new')
}

function edit(id: number) {
  router.push(`/admin/pools/${id}/edit`)
}

async function toggle(row: (typeof pools.value)[number]) {
  const action = row.status === 'ON' ? '关闭' : '开启'
  await ElMessageBox.confirm(`确认${action}该兑换池吗？`, '提示')
    .then(() => {
      row.status = row.status === 'ON' ? 'OFF' : 'ON'
      ElMessage.success(`${action}成功`)
    })
    .catch(() => undefined)
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Pools</h1>
      <el-button type="primary" @click="goNew">新建兑换池</el-button>
    </div>

    <el-card shadow="never">
      <el-table :data="pools" border>
        <el-table-column prop="name" label="名称" min-width="180" />
        <el-table-column prop="startAt" label="开始时间" width="140" />
        <el-table-column prop="endAt" label="结束时间" width="140" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'ON' ? 'success' : 'info'">
              {{ scope.row.status === 'ON' ? '开启' : '关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="edit(scope.row.id)">编辑</el-button>
            <el-button link type="warning">配置商品</el-button>
            <el-button link type="info" @click="toggle(scope.row)">
              {{ scope.row.status === 'ON' ? '关闭' : '开启' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
