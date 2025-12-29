<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { AdminSubmission } from '../../api/types'
import { approveSubmission, fetchSubmissions } from '../../api/modules/adminSubmissions'

const router = useRouter()
const status = ref<string>('')
const submissions = ref<AdminSubmission[]>([])
const loading = ref(false)
const actionSubmission = ref<string | null>(null)
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

const statusLabel: Record<string, string> = {
  PENDING: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝',
}

async function loadSubmissions() {
  loading.value = true
  try {
    const data = await fetchSubmissions({
      page: pagination.page,
      size: pagination.size,
      status: status.value || undefined,
    })
    submissions.value = data.records || []
    pagination.total = data.total ?? 0
  } catch (error) {
    submissions.value = []
  } finally {
    loading.value = false
  }
}

function viewDetail(submissionNo: string) {
  router.push(`/admin/submissions/${submissionNo}`)
}

async function quickApprove(row: AdminSubmission) {
  if (row.status !== 'PENDING') {
    return
  }
  actionSubmission.value = row.submissionNo
  try {
    await approveSubmission(row.submissionNo, { pointsAwarded: row.pointReward })
    ElMessage.success('已通过并发放积分')
    await loadSubmissions()
  } finally {
    actionSubmission.value = null
  }
}

function handlePageChange(page: number) {
  pagination.page = page
  loadSubmissions()
}

function handleSizeChange(size: number) {
  pagination.size = size
  pagination.page = 1
  loadSubmissions()
}

onMounted(loadSubmissions)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Submissions</h1>
      <el-button type="primary" plain size="small" @click="loadSubmissions">刷新</el-button>
    </div>

    <el-card shadow="never">
      <div class="filter-bar">
        <el-select v-model="status" placeholder="状态" clearable style="width: 160px" size="small">
          <el-option label="待审核" value="PENDING" />
          <el-option label="已通过" value="APPROVED" />
          <el-option label="已拒绝" value="REJECTED" />
        </el-select>
        <el-button type="primary" plain size="small" @click="loadSubmissions">查询</el-button>
      </div>

      <el-table :data="submissions" border :loading="loading">
        <el-table-column prop="submissionNo" label="提交编号" min-width="140" />
        <el-table-column prop="taskTitle" label="任务" min-width="200" />
        <el-table-column label="用户" min-width="180">
          <template #default="scope">
            <div>{{ scope.row.username }}</div>
            <div class="sub-text">{{ scope.row.userEmail }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="pointReward" label="积分奖励" width="100" />
        <el-table-column prop="createdAt" label="提交时间" min-width="160" />
        <el-table-column label="状态" width="110">
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
              {{ statusLabel[scope.row.status] ?? scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row.submissionNo)">查看</el-button>
            <el-button
              link
              type="success"
              :loading="actionSubmission === scope.row.submissionNo"
              :disabled="scope.row.status !== 'PENDING'"
              @click="quickApprove(scope.row)"
            >
              通过
            </el-button>
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

.sub-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
