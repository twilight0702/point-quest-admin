<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fetchTasks, deleteTask } from '../../api/modules/adminTasks'
import type { Task } from '../../api/types'

const router = useRouter()
const status = ref('')

const tasks = ref<Task[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

const statusLabel: Record<string, string> = {
  OPEN: '进行中',
  CLOSED: '已关闭',
  ENDED: '已结束',
}

async function loadTasks() {
  loading.value = true
  try {
    const data = await fetchTasks({
      page: pagination.page,
      size: pagination.size,
      status: status.value || undefined,
    })
    tasks.value = data.records || []
    pagination.total = data.total ?? 0
  } catch (error) {
    tasks.value = []
  } finally {
    loading.value = false
  }
}

function goNew() {
  router.push('/admin/tasks/new')
}

function editTask(taskNo: string) {
  router.push(`/admin/tasks/${taskNo}/edit`)
}

async function handleDelete(taskNo: string) {
  await deleteTask(taskNo)
  ElMessage.success('已删除')
  await loadTasks()
}

function handlePageChange(page: number) {
  pagination.page = page
  loadTasks()
}

onMounted(loadTasks)
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
          <el-option label="已关闭" value="CLOSED" />
          <el-option label="已结束" value="ENDED" />
        </el-select>
        <el-button type="primary" plain size="small" @click="loadTasks">查询</el-button>
      </div>

      <el-table :data="tasks" border :loading="loading">
        <el-table-column prop="taskNo" label="任务编号" width="140" />
        <el-table-column prop="title" label="标题" min-width="180" />
        <el-table-column prop="pointReward" label="积分奖励" width="100" />
        <el-table-column prop="deadline" label="截止时间" width="160" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'OPEN' ? 'success' : scope.row.status === 'CLOSED' ? 'warning' : 'info'">
              {{ statusLabel[scope.row.status] ?? scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="editTask(scope.row.taskNo)">编辑</el-button>
            <el-popconfirm title="确认删除该任务？" @confirm="handleDelete(scope.row.taskNo)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="pagination.page"
          :page-size="pagination.size"
          :total="pagination.total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
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
