<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  addRewardCategory,
  deleteReward,
  deleteRewardCategory,
  fetchRewardCategories,
  fetchRewards,
  updateRewardCategory,
} from '../../api/modules/adminRewards'
import type { Reward, RewardCategory } from '../../api/types'

const router = useRouter()

const filters = reactive({
  status: '',
  keyword: '',
})

const rewards = ref<Reward[]>([])
const loading = ref(false)
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

const categories = ref<RewardCategory[]>([])
const categoriesLoading = ref(false)
const categoryDialog = reactive({
  visible: false,
  editingId: null as number | null,
  name: '',
})
const categorySaving = ref(false)

const statusLabel: Record<string, string> = {
  ON: '上架',
  OFF: '下架',
}

async function loadRewards() {
  loading.value = true
  try {
    const data = await fetchRewards({
      page: pagination.page,
      size: pagination.size,
      status: filters.status || undefined,
      keyword: filters.keyword || undefined,
    })
    rewards.value = data.records || []
    pagination.total = data.total ?? 0
  } catch (error) {
    rewards.value = []
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  categoriesLoading.value = true
  try {
    const data = await fetchRewardCategories()
    categories.value = data.categories || []
  } finally {
    categoriesLoading.value = false
  }
}

function goNew() {
  router.push('/admin/rewards/new')
}

function editReward(rewardNo: string) {
  router.push(`/admin/rewards/${rewardNo}/edit`)
}

async function handleDelete(row: Reward) {
  try {
    await ElMessageBox.confirm(`确认删除奖品「${row.name}」？`, '提示', { type: 'warning' })
    await deleteReward(row.rewardNo)
    ElMessage.success('已删除')
    await loadRewards()
  } catch (error) {
    // 用户取消或请求失败，已提示
  }
}

function handleSearch() {
  pagination.page = 1
  loadRewards()
}

function handlePageChange(page: number) {
  pagination.page = page
  loadRewards()
}

function handleSizeChange(size: number) {
  pagination.size = size
  pagination.page = 1
  loadRewards()
}

function openCategoryDialog(category?: RewardCategory) {
  categoryDialog.visible = true
  categoryDialog.editingId = category?.id ?? null
  categoryDialog.name = category?.name ?? ''
  loadCategories()
}

function closeCategoryDialog() {
  categoryDialog.visible = false
  categoryDialog.editingId = null
  categoryDialog.name = ''
}

async function handleSaveCategory() {
  const name = categoryDialog.name.trim()
  if (!name) {
    ElMessage.warning('请输入分类名称')
    return
  }
  categorySaving.value = true
  try {
    if (categoryDialog.editingId) {
      await updateRewardCategory(categoryDialog.editingId, name)
      ElMessage.success('已保存分类')
    } else {
      await addRewardCategory(name)
      ElMessage.success('已新增分类')
    }
    await loadCategories()
    closeCategoryDialog()
  } finally {
    categorySaving.value = false
  }
}

async function handleDeleteCategory(category: RewardCategory) {
  try {
    await ElMessageBox.confirm(`确认删除分类「${category.name}」？`, '提示', { type: 'warning' })
    await deleteRewardCategory(category.id)
    ElMessage.success('已删除分类')
    await loadCategories()
  } catch (error) {
    // 用户取消或请求失败，已提示
  }
}

onMounted(async () => {
  await Promise.all([loadRewards(), loadCategories()])
})
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Rewards</h1>
      <el-button type="primary" @click="goNew">新建奖品</el-button>
    </div>

    <el-card shadow="never">
      <div class="filter-bar">
        <el-select v-model="filters.status" placeholder="状态" clearable size="small" style="width: 140px">
          <el-option label="上架" value="ON" />
          <el-option label="下架" value="OFF" />
        </el-select>
        <el-input
          v-model="filters.keyword"
          placeholder="按名称或编号搜索"
          clearable
          size="small"
          style="width: 220px"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" plain size="small" @click="handleSearch">查询</el-button>
        <el-button size="small" @click="openCategoryDialog()">管理分类</el-button>
      </div>

      <el-table :data="rewards" border :loading="loading">
        <el-table-column prop="rewardNo" label="奖品编号" width="140" />
        <el-table-column prop="name" label="名称" min-width="160" />
        <el-table-column label="商品图" width="160">
          <template #default="scope">
            <div v-if="scope.row.imageUrls?.length" class="thumb-wrapper">
              <el-image
                :src="scope.row.imageUrls[0]"
                fit="cover"
                class="thumb"
                :preview-src-list="scope.row.imageUrls"
              />
              <div v-if="(scope.row.imageUrls?.length ?? 0) > 1" class="thumb-count">
                +{{ (scope.row.imageUrls?.length ?? 0) - 1 }}
              </div>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="pointCost" label="积分消耗" width="100" />
        <el-table-column prop="stock" label="库存" width="90" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'ON' ? 'success' : 'info'">
              {{ statusLabel[scope.row.status] ?? scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分类" min-width="160">
          <template #default="scope">
            {{ scope.row.categoryNames?.join('、') || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="editReward(scope.row.rewardNo)">编辑</el-button>
            <el-popconfirm title="确认删除该奖品？" @confirm="handleDelete(scope.row)">
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

    <el-dialog v-model="categoryDialog.visible" title="分类管理" width="520px" @close="closeCategoryDialog">
      <el-form label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="categoryDialog.name" placeholder="请输入分类名称" />
        </el-form-item>
        <div class="dialog-actions">
          <el-button @click="closeCategoryDialog">取消</el-button>
          <el-button type="primary" :loading="categorySaving" @click="handleSaveCategory">
            {{ categoryDialog.editingId ? '保存' : '新增' }}
          </el-button>
        </div>
      </el-form>

      <el-table :data="categories" :loading="categoriesLoading" size="small" border style="margin-top: 12px">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="openCategoryDialog(scope.row)">编辑</el-button>
            <el-popconfirm title="确认删除该分类？" @confirm="handleDeleteCategory(scope.row)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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

.thumb-wrapper {
  position: relative;
  width: 120px;
  height: 80px;
}

.thumb {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  cursor: pointer;
}

.thumb-count {
  position: absolute;
  right: 6px;
  bottom: 6px;
  padding: 2px 6px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 12px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
