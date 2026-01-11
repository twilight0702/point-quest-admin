<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  createPool,
  fetchPoolDetail,
  updatePool,
  type PoolItemPayload,
} from '../../api/modules/adminPools'
import { fetchRewards } from '../../api/modules/adminRewards'

interface PoolItemForm extends PoolItemPayload {
  rewardName?: string
  rewardNo?: string
}

const props = defineProps<{ poolNo?: string; mode?: 'create' | 'edit' }>()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const submitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  pointCost: 0,
  status: 'ON' as 'ON' | 'OFF',
  type: '',
  dateRange: [] as string[],
  items: [] as PoolItemForm[],
})

const rewards = ref<Reward[]>([])
const rewardsLoading = ref(false)

const isEdit = computed(() => !!props.poolNo || props.mode === 'edit')
const statusOptions = [
  { label: '开启', value: 'ON' },
  { label: '关闭', value: 'OFF' },
]

const rules: FormRules = {
  title: [{ required: true, message: '请输入奖池标题', trigger: 'blur' }],
  pointCost: [{ required: true, message: '请输入积分消耗', trigger: 'change' }],
}

async function loadRewards() {
  rewardsLoading.value = true
  try {
    const data = await fetchRewards({ page: 1, size: 100, status: 'ON' })
    rewards.value = data.records || []
  } finally {
    rewardsLoading.value = false
  }
}

function syncRewardInfo(item: PoolItemForm) {
  const reward = rewards.value.find((r) => r.id === item.rewardId)
  item.rewardName = reward?.name
  item.rewardNo = reward?.rewardNo
  item.weight = item.weight ?? 0
  item.sortNo = item.sortNo ?? 1
}

async function loadDetail() {
  if (!props.poolNo) return
  loading.value = true
  try {
    const data = await fetchPoolDetail(props.poolNo)
    form.title = data.title
    form.description = data.description || ''
    form.pointCost = data.pointCost
    form.status = (data.status as 'ON' | 'OFF') || 'ON'
    form.type = data.type || ''
    form.dateRange = data.startAt || data.endAt ? [data.startAt || '', data.endAt || ''] : []
    form.items = (data.items || []).map((item, index) => ({
      rewardId: item.rewardId,
      rewardName: item.rewardName,
      rewardNo: item.rewardNo,
      weight: item.weight ?? 0,
      sortNo: item.sortNo ?? index + 1,
    }))
    form.items.forEach(syncRewardInfo)
  } finally {
    loading.value = false
  }
}

function addItem() {
  if (!rewards.value.length) {
    ElMessage.warning('请先创建奖品后再配置奖品列表')
    return
  }
  const firstReward = rewards.value[0]
  const newItem: PoolItemForm = {
    rewardId: firstReward.id,
    rewardName: firstReward.name,
    rewardNo: firstReward.rewardNo,
    weight: 1,
    sortNo: form.items.length + 1,
  }
  form.items.push(newItem)
}

function removeItem(index: number) {
  form.items.splice(index, 1)
}

function buildPayload() {
  return {
    title: form.title,
    description: form.description || undefined,
    pointCost: form.pointCost,
    status: form.status,
    type: form.type || undefined,
    startAt: form.dateRange[0] || undefined,
    endAt: form.dateRange[1] || undefined,
    items: form.items
      .filter((item) => item.rewardId)
      .map((item, index) => ({
        rewardId: item.rewardId!,
        sortNo: item.sortNo ?? index + 1,
        weight: item.weight ?? 0,
      })),
  }
}

function validateItems(): boolean {
  if (!form.items.length) {
    ElMessage.warning('请至少添加一个奖品')
    return false
  }
  const invalid = form.items.some((item) => !item.rewardId || item.weight === undefined || item.weight < 0)
  if (invalid) {
    ElMessage.warning('请完善奖品、权重和排序信息')
    return false
  }
  return true
}

function onSubmit() {
  formRef.value?.validate(async (valid) => {
    if (!valid || !validateItems()) return
    const payload = buildPayload()
    submitting.value = true
    try {
      if (isEdit.value && props.poolNo) {
        await updatePool(props.poolNo, payload)
        ElMessage.success('已保存修改')
      } else {
        await createPool(payload)
        ElMessage.success('创建成功')
      }
      router.push('/admin/pools')
    } finally {
      submitting.value = false
    }
  })
}

onMounted(async () => {
  await loadRewards()
  if (isEdit.value) {
    await loadDetail()
  }
})
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>{{ isEdit ? '编辑奖池' : '新建奖池' }}</h1>
      <el-button plain @click="router.back()">返回</el-button>
    </div>

    <el-card shadow="never" v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" label-position="left">
        <template v-if="isEdit && props.poolNo">
          <el-form-item label="奖池编号">
            <el-input :model-value="props.poolNo" disabled />
          </el-form-item>
        </template>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="奖池标题" />
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
            <el-form-item label="状态">
              <el-segmented v-model="form.status" :options="statusOptions" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-input v-model="form.type" placeholder="可选：活动、盲盒等" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="form.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DDTHH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" rows="4" placeholder="奖池说明、活动规则等" />
        </el-form-item>

        <el-form-item label="奖品列表">
          <div class="items-block">
            <el-table :data="form.items" border size="small" style="width: 100%">
              <el-table-column type="index" label="序号" width="70" />
              <el-table-column label="奖品" min-width="200">
                <template #default="scope">
                  <el-select
                    v-model="scope.row.rewardId"
                    filterable
                    placeholder="选择奖品"
                    style="width: 100%"
                    :loading="rewardsLoading"
                    @change="() => syncRewardInfo(scope.row)"
                  >
                    <el-option
                      v-for="reward in rewards"
                      :key="reward.id"
                      :label="`${reward.name}（${reward.rewardNo}）`"
                      :value="reward.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="rewardNo" label="奖品编号" width="140">
                <template #default="scope">{{ scope.row.rewardNo || '-' }}</template>
              </el-table-column>
              <el-table-column label="权重" width="140">
                <template #default="scope">
                  <el-input-number v-model="scope.row.weight" :min="0" />
                </template>
              </el-table-column>
              <el-table-column label="排序" width="140">
                <template #default="scope">
                  <el-input-number v-model="scope.row.sortNo" :min="1" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template #default="scope">
                  <el-button link type="danger" @click="removeItem(scope.$index)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="item-actions">
              <el-button type="primary" plain size="small" @click="addItem">新增奖品</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="onSubmit">
            {{ isEdit ? '保存修改' : '创建奖池' }}
          </el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.items-block {
  width: 100%;
}

.item-actions {
  margin-top: 8px;
  text-align: right;
}
</style>
