<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

const props = defineProps<{ id?: string }>()
const formRef = ref<FormInstance>()

const submission = reactive({
  id: props.id || '101',
  task: '每日签到截图',
  user: 'alice',
  status: 'PENDING',
  submittedAt: '今天 08:30',
  evidence: 'https://placehold.co/120x80',
})

const review = reactive({
  points: 50,
  comment: '',
})

function approve() {
  ElMessage.success('已通过并发放积分')
}

function reject() {
  if (!review.comment) {
    ElMessage.warning('请填写拒绝原因')
    return
  }
  ElMessage.success('已拒绝该提交')
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Submission #{{ submission.id }}</h1>
      <el-button plain @click="$router.back()">返回</el-button>
    </div>

    <el-row :gutter="16">
      <el-col :span="14">
        <el-card shadow="never">
          <template #header>提交内容</template>
          <div class="info">
            <div><strong>任务：</strong>{{ submission.task }}</div>
            <div><strong>用户：</strong>{{ submission.user }}</div>
            <div><strong>提交时间：</strong>{{ submission.submittedAt }}</div>
            <div class="section">
              <strong>凭证：</strong>
              <img :src="submission.evidence" alt="evidence" class="evidence" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never">
          <template #header>审核操作</template>
          <el-form ref="formRef" :model="review" label-position="top">
            <el-form-item label="发放积分">
              <el-input-number v-model="review.points" :min="0" :step="10" />
            </el-form-item>
            <el-form-item label="备注/拒绝原因">
              <el-input
                v-model="review.comment"
                type="textarea"
                rows="4"
                placeholder="通过时可填写说明，拒绝时需填写原因"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="approve">通过并发放</el-button>
              <el-button type="danger" plain @click="reject">拒绝</el-button>
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
  gap: 8px;
}

.evidence {
  width: 160px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  margin-top: 6px;
}
</style>
