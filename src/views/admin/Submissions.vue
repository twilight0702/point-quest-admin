<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const status = ref('PENDING')

const submissions = ref([
  { id: 101, task: '每日签到截图', user: 'alice', status: 'PENDING', submittedAt: '今天 08:30' },
  { id: 102, task: '课程测验', user: 'bob', status: 'PENDING', submittedAt: '今天 09:10' },
  { id: 103, task: '新年问卷', user: 'chris', status: 'APPROVED', submittedAt: '昨天' },
])

function viewDetail(id: number) {
  router.push(`/admin/submissions/${id}`)
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Submissions</h1>
      <el-button type="primary" plain size="small">刷新</el-button>
    </div>

    <el-card shadow="never">
      <div class="filter-bar">
        <el-select v-model="status" placeholder="状态" style="width: 160px" size="small">
          <el-option label="待审核" value="PENDING" />
          <el-option label="已通过" value="APPROVED" />
          <el-option label="已拒绝" value="REJECTED" />
        </el-select>
        <el-button type="primary" plain size="small">筛选</el-button>
      </div>

      <el-table :data="submissions" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="task" label="任务" min-width="160" />
        <el-table-column prop="user" label="用户" width="120" />
        <el-table-column prop="submittedAt" label="提交时间" width="140" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.status === 'PENDING'
                  ? 'warning'
                  : scope.row.status === 'APPROVED'
                    ? 'success'
                    : 'info'
              "
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row.id)">查看</el-button>
            <el-button link type="success">通过</el-button>
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
