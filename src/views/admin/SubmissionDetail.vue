<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  approveSubmission,
  fetchSubmissionDetail,
  rejectSubmission,
} from '../../api/modules/adminSubmissions'
import type { AdminSubmissionDetail } from '../../api/types'

const props = defineProps<{ submissionNo: string }>()

const loading = ref(false)
const submitting = reactive({ approve: false, reject: false })
const submission = ref<AdminSubmissionDetail | null>(null)
const review = reactive({
  pointsAwarded: undefined as number | undefined,
  comment: '',
})

const statusLabel: Record<string, string> = {
  PENDING: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝',
}

const canReview = computed(() => submission.value?.status === 'PENDING')

async function loadDetail() {
  loading.value = true
  try {
    const data = await fetchSubmissionDetail(props.submissionNo)
    submission.value = data
    review.pointsAwarded = data.pointsAwarded ?? data.pointReward
    review.comment = data.reviewComment ?? ''
  } finally {
    loading.value = false
  }
}

async function handleApprove() {
  if (!submission.value) return
  submitting.approve = true
  try {
    await approveSubmission(submission.value.submissionNo, {
      pointsAwarded: review.pointsAwarded,
      comment: review.comment || undefined,
    })
    ElMessage.success('已审核通过并发放积分')
    await loadDetail()
  } finally {
    submitting.approve = false
  }
}

async function handleReject() {
  if (!submission.value) return
  if (!review.comment) {
    ElMessage.warning('请填写拒绝原因')
    return
  }
  submitting.reject = true
  try {
    await rejectSubmission(submission.value.submissionNo, { comment: review.comment })
    ElMessage.success('已拒绝该提交')
    await loadDetail()
  } finally {
    submitting.reject = false
  }
}

onMounted(loadDetail)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Submission #{{ submission?.submissionNo ?? props.submissionNo }}</h1>
      <el-button plain @click="$router.back()">返回</el-button>
    </div>

    <el-row :gutter="16">
      <el-col :span="14">
        <el-card shadow="never" :loading="loading">
          <template #header>提交内容</template>
          <template v-if="submission">
            <div class="info">
              <div><strong>任务：</strong>{{ submission.taskTitle }}（{{ submission.taskNo }}）</div>
              <div>
                <strong>用户：</strong>{{ submission.username }}
                <span class="sub-text">{{ submission.userEmail }}</span>
              </div>
              <div><strong>提交时间：</strong>{{ submission.createdAt }}</div>
              <div><strong>积分奖励：</strong>{{ submission.pointReward }}</div>
              <div class="status-row">
                <strong>状态：</strong>
                <el-tag
                  :type="
                    submission.status === 'PENDING'
                      ? 'warning'
                      : submission.status === 'APPROVED'
                        ? 'success'
                        : 'info'
                  "
                >
                  {{ statusLabel[submission.status] ?? submission.status }}
                </el-tag>
              </div>
              <div class="section">
                <strong>文字说明：</strong>
                <p class="text-block">{{ submission.evidenceText || '（无）' }}</p>
              </div>
              <div class="section">
                <strong>佐证材料：</strong>
                <div v-if="submission.evidencePreviewUrls?.length" class="evidence-list">
                  <el-image
                    v-for="url in submission.evidencePreviewUrls"
                    :key="url"
                    :src="url"
                    fit="cover"
                    class="evidence"
                  />
                </div>
                <div v-else class="sub-text">暂无图片佐证</div>
              </div>
              <div v-if="submission.pointsAwarded || submission.reviewComment" class="section">
                <strong>审核备注：</strong>
                <div class="text-block">
                  <div v-if="submission.pointsAwarded !== undefined">已发放积分：{{ submission.pointsAwarded }}</div>
                  <div v-if="submission.reviewComment">{{ submission.reviewComment }}</div>
                </div>
              </div>
            </div>
          </template>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never" :loading="loading">
          <template #header>审核操作</template>
          <el-form label-position="top">
            <el-form-item label="发放积分">
              <el-input-number v-model="review.pointsAwarded" :min="0" :step="10" />
              <div class="sub-text">留空则使用任务默认奖励</div>
            </el-form-item>
            <el-form-item label="备注 / 拒绝原因">
              <el-input
                v-model="review.comment"
                type="textarea"
                rows="4"
                placeholder="通过可填写说明，拒绝需填写原因"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="success"
                :loading="submitting.approve"
                :disabled="!canReview"
                @click="handleApprove"
              >
                通过并发放积分
              </el-button>
              <el-button
                type="danger"
                plain
                :loading="submitting.reject"
                :disabled="!canReview"
                @click="handleReject"
              >
                拒绝
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.section {
  margin-top: 8px;
}

.text-block {
  margin: 4px 0 0;
  white-space: pre-wrap;
}

.evidence-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.evidence {
  width: 160px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.sub-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-left: 4px;
}
</style>
