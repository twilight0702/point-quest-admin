<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const status = ref('')
const keyword = ref('')

const tasks = ref([
  { id: 1, title: '每日签到截图', status: 'OPEN', pointReward: 50, deadline: '2025-01-01' },
  { id: 2, title: '完成课程测验', status: 'OPEN', pointReward: 100, deadline: '2025-01-05' },
  { id: 3, title: '新年问卷', status: 'CLOSED', pointReward: 80, deadline: '2024-12-30' },
])

function goNew() {
  router.push('/admin/tasks/new')
}

function editTask(id: number) {
  router.push(`/admin/tasks/${id}/edit`)
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Tasks</h1>
      <el-button type="primary" @click="goNew">新建任务</el-button>
    </div>

    <el-card shadow="never">
      <div class="filter-bar">
        <el-select v-model="status" placeholder="状态" clearable size="small" style="width: 140px">
          <el-option label="进行中" value="OPEN" />
          <el-option label="已结束" value="CLOSED" />
        </el-select>
        <el-input
          v-model="keyword"
          placeholder="按标题搜索"
          clearable
          size="small"
          style="width: 220px"
        />
        <el-button type="primary" plain size="small">查询</el-button>
      </div>

      <el-table :data="tasks" border>
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="pointReward" label="积分奖励" width="100" />
        <el-table-column prop="deadline" label="截止时间" width="150" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'OPEN' ? 'success' : 'info'">
              {{ scope.row.status === 'OPEN' ? '进行中' : '已结束' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="editTask(scope.row.id)">编辑</el-button>
            <el-button link type="warning">结束</el-button>
          </template>
        </el-table-column>
      </el-table>
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
</style>
