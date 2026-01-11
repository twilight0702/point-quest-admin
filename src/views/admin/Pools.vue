<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deletePool, fetchPools } from '../../api/modules/adminPools'
import type { Pool } from '../../api/types'

const router = useRouter()
const filters = reactive({
  status: '',
})

const pools = ref<Pool[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

const statusLabel: Record<string, string> = {
  ON: '开启',
  OFF: '关闭',
}

async function loadPools() {
  loading.value = true
  try {
    const data = await fetchPools({
      page: pagination.page,
      size: pagination.size,
      status: filters.status || undefined,
    })
    pools.value = data.records || []
    pagination.total = data.total ?? 0
  } catch (error) {
    pools.value = []
  } finally {
    loading.value = false
  }
}

function goNew() {
  router.push('/admin/pools/new')
}

function edit(poolNo: string) {
  router.push(`/admin/pools/${poolNo}/edit`)
}

async function handleDelete(row: Pool) {
  try {
    await ElMessageBox.confirm(`确认删除奖池「${row.title}」？`, '提示', { type: 'warning' })
    await deletePool(row.poolNo)
    ElMessage.success('已删除')
    await loadPools()
  } catch (error) {
    // 用户取消或请求失败，已提示
  }
}

function handleSearch() {
  pagination.page = 1
  loadPools()
}

function handlePageChange(page: number) {
  pagination.page = page
  loadPools()
}

function handleSizeChange(size: number) {
  pagination.size = size
  pagination.page = 1
  loadPools()
}

onMounted(loadPools)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>奖池</h1>
      <el-button type="primary" @click="goNew">新建奖池</el-button>
    </div>

    <el-card shadow="never">
      <div class="filter-bar">
        <el-select v-model="filters.status" placeholder="状态" clearable size="small" style="width: 140px">
          <el-option label="开启" value="ON" />
          <el-option label="关闭" value="OFF" />
        </el-select>
        <el-button type="primary" plain size="small" @click="handleSearch">查询</el-button>
      </div>

      <el-table :data="pools" border :loading="loading">
        <el-table-column prop="poolNo" label="奖池编号" width="140" />
        <el-table-column prop="title" label="标题" min-width="180" />
        <el-table-column prop="pointCost" label="积分消耗" width="100" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="startAt" label="开始时间" width="160" />
        <el-table-column prop="endAt" label="结束时间" width="160" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'ON' ? 'success' : 'info'">
              {{ statusLabel[scope.row.status] ?? scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="edit(scope.row.poolNo)">编辑</el-button>
            <el-popconfirm title="确认删除该奖池？" @confirm="handleDelete(scope.row)">
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
