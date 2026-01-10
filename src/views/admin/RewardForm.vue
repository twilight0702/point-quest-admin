<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules, UploadRequestOptions } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  addRewardCategory,
  createReward,
  deleteRewardCategory,
  fetchRewardCategories,
  fetchRewardDetail,
  uploadRewardImage,
  updateReward,
  updateRewardCategory,
} from '../../api/modules/adminRewards'
import type { RewardCategory } from '../../api/types'

const props = defineProps<{ rewardNo?: string; mode?: 'create' | 'edit' }>()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const submitting = ref(false)

const form = reactive({
  name: '',
  description: '',
  pointCost: 0,
  stock: 0,
  status: 'ON' as 'ON' | 'OFF',
  categoryIds: [] as number[],
})

const categories = ref<RewardCategory[]>([])
const categoriesLoading = ref(false)
const categoryDialog = reactive({
  visible: false,
  editingId: null as number | null,
  name: '',
})
const categorySaving = ref(false)
const rewardImages = ref<string[]>([])
const uploadingImage = ref(false)

const isEdit = computed(() => !!props.rewardNo || props.mode === 'edit')

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  pointCost: [{ required: true, message: '请输入积分消耗', trigger: 'change' }],
  stock: [{ type: 'number', min: 0, message: '库存需大于等于0', trigger: 'change' }],
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

async function loadDetail() {
  if (!props.rewardNo) return
  loading.value = true
  try {
    const data = await fetchRewardDetail(props.rewardNo)
    form.name = data.name
    form.description = data.description || ''
    form.pointCost = data.pointCost
    form.stock = data.stock ?? 0
    form.status = (data.status as 'ON' | 'OFF') || 'ON'
    form.categoryIds = data.categoryIds || []
    rewardImages.value = data.imageUrls || []
  } finally {
    loading.value = false
  }
}

function buildPayload() {
  return {
    name: form.name,
    description: form.description || undefined,
    pointCost: form.pointCost,
    status: form.status,
    stock: form.stock ?? 0,
    categoryIds: form.categoryIds,
  }
}

function handleSubmit() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      if (isEdit.value && props.rewardNo) {
        await updateReward(props.rewardNo, buildPayload())
        ElMessage.success('已保存修改')
      } else {
        await createReward(buildPayload())
        ElMessage.success('创建成功')
      }
      router.push('/admin/rewards')
    } finally {
      submitting.value = false
    }
  })
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
    form.categoryIds = form.categoryIds.filter((id) => id !== category.id)
    await loadCategories()
  } catch (error) {
    // 用户取消或请求失败，已提示
  }
}

async function handleUploadRequest(options: UploadRequestOptions) {
  const { file, onError, onSuccess } = options
  if (!props.rewardNo) {
    ElMessage.warning('请先创建奖品后再上传图片')
    onError?.(new Error('Reward not created'))
    return
  }
  uploadingImage.value = true
  try {
    const url = await uploadRewardImage(props.rewardNo, file as File)
    rewardImages.value = [...rewardImages.value, url]
    onSuccess?.(url)
    ElMessage.success('已上传图片')
  } catch (error) {
    onError?.(error as Error)
  } finally {
    uploadingImage.value = false
  }
}

onMounted(async () => {
  await loadCategories()
  if (isEdit.value) {
    await loadDetail()
  }
})
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>{{ isEdit ? '编辑奖品' : '新建奖品' }}</h1>
      <el-button plain @click="router.back()">返回</el-button>
    </div>

    <el-card shadow="never" v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" label-position="left">
        <template v-if="isEdit && props.rewardNo">
          <el-form-item label="奖品编号">
            <el-input :model-value="props.rewardNo" disabled />
          </el-form-item>
        </template>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="奖品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="积分消耗" prop="pointCost">
              <el-input-number v-model="form.pointCost" :min="0" :step="10" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="初始库存" prop="stock">
              <el-input-number v-model="form.stock" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-segmented v-model="form.status" :options="['ON', 'OFF']" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="分类">
          <div class="category-select-row">
            <el-select
              v-model="form.categoryIds"
              multiple
              filterable
              clearable
              placeholder="选择分类"
              style="width: 100%"
              :loading="categoriesLoading"
            >
              <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
            </el-select>
            <el-button size="small" @click="openCategoryDialog()">管理分类</el-button>
          </div>
        </el-form-item>
        <el-form-item label="商品图片">
          <div class="image-section">
            <div v-if="isEdit" class="uploader-row">
              <el-upload
                class="image-uploader"
                action=""
                :http-request="handleUploadRequest"
                :show-file-list="false"
                accept="image/*"
                :disabled="uploadingImage"
              >
                <div class="upload-card">
                  <el-icon class="upload-icon"><Plus /></el-icon>
                  <div>上传图片</div>
                </div>
              </el-upload>
              <div class="upload-hint">上传后自动保存，点击下方缩略图可查看大图</div>
            </div>
            <div v-else class="upload-hint">创建并保存后可上传商品图片</div>
            <div v-if="rewardImages.length" class="image-list">
              <el-image
                v-for="(url, idx) in rewardImages"
                :key="url + idx"
                :src="url"
                fit="cover"
                class="reward-image"
                :preview-src-list="rewardImages"
                :initial-index="idx"
              />
            </div>
            <div v-else class="sub-text">暂无商品图片</div>
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            rows="4"
            placeholder="说明兑换方式、使用规则等"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            {{ isEdit ? '保存修改' : '创建奖品' }}
          </el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
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
.category-select-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.image-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.uploader-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.image-uploader {
  width: 140px;
}

.upload-card {
  width: 140px;
  height: 140px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--el-text-color-secondary);
  background: #fafafa;
}

.upload-icon {
  font-size: 20px;
}

.upload-hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.image-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.reward-image {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  cursor: pointer;
}

.sub-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
