<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const status = ref('')
const keyword = ref('')

const rewards = ref([
  { id: 11, name: '50元京东卡', pointCost: 500, stock: 15, status: 'ON' },
  { id: 12, name: '运动水杯', pointCost: 200, stock: 6, status: 'ON' },
  { id: 13, name: '会员月卡', pointCost: 300, stock: 0, status: 'OFF' },
])

function goNew() {
  router.push('/admin/rewards/new')
}

function edit(id: number) {
  router.push(`/admin/rewards/${id}/edit`)
}

async function adjust(id: number) {
  await ElMessageBox.prompt('请输入调整数量，可为正负数', '调整库存', {
    inputPlaceholder: '+10 或 -5',
  })
    .then(() => ElMessage.success('已记录库存调整'))
    .catch(() => undefined)
}

async function toggle(row: (typeof rewards.value)[number]) {
  const action = row.status === 'ON' ? '下线' : '上线'
  await ElMessageBox.confirm(`确认${action}该奖品吗？`, '提示')
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
      <h1>Rewards</h1>
      <el-button type="primary" @click="goNew">新建奖品</el-button>
    </div>

    <el-card shadow="never">
      <div class="filter-bar">
        <el-select v-model="status" placeholder="状态" clearable size="small" style="width: 140px">
          <el-option label="已上线" value="ON" />
          <el-option label="已下线" value="OFF" />
        </el-select>
        <el-input
          v-model="keyword"
          placeholder="按名称或编码搜索"
          clearable
          size="small"
          style="width: 220px"
        />
        <el-button type="primary" plain size="small">查询</el-button>
      </div>

      <el-table :data="rewards" border>
        <el-table-column prop="name" label="名称" min-width="160" />
        <el-table-column prop="pointCost" label="积分价" width="90" />
        <el-table-column prop="stock" label="库存" width="90" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'ON' ? 'success' : 'info'">
              {{ scope.row.status === 'ON' ? '上线' : '下线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="edit(scope.row.id)">编辑</el-button>
            <el-button link type="warning" @click="adjust(scope.row.id)">调库存</el-button>
            <el-button link type="info" @click="toggle(scope.row)">
              {{ scope.row.status === 'ON' ? '下线' : '上线' }}
            </el-button>
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
