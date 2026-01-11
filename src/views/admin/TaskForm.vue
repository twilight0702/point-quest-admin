<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { createTask, fetchTaskDetail, updateTask } from '../../api/modules/adminTasks'
import type { TaskStatus } from '../../api/types'

const props = defineProps<{ taskNo?: string; mode?: 'create' | 'edit' }>()
const router = useRouter()
const formRef = ref<FormInstance>()

const form = reactive({
  title: '',
  description: '',
  pointReward: 0,
  deadline: '',
  status: 'OPEN' as TaskStatus,
})

const isEdit = computed(() => !!props.taskNo || props.mode === 'edit')
const statusOptions = [
  { label: '进行中', value: 'OPEN' },
  { label: '已关闭', value: 'CLOSED' },
  { label: '已结束', value: 'ENDED' },
]

const rules: FormRules = {
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  pointReward: [{ required: true, message: '请输入积分奖励', trigger: 'blur' }],
}

async function loadDetail() {
  if (!props.taskNo) return
  const detail = await fetchTaskDetail(props.taskNo)
  form.title = detail.title
  form.description = detail.description ?? ''
  form.pointReward = detail.pointReward
  form.deadline = detail.deadline ?? ''
  form.status = detail.status
}

onMounted(() => {
  if (isEdit.value) {
    loadDetail()
  }
})

function onSubmit() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    if (isEdit.value && props.taskNo) {
      await updateTask(props.taskNo, form)
      ElMessage.success('已保存')
    } else {
      await createTask(form)
      ElMessage.success('创建成功')
    }
    router.push('/admin/tasks')
  })
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>{{ isEdit ? '编辑任务' : '新建任务' }}</h1>
      <el-button plain @click="router.back()">返回</el-button>
    </div>

    <el-card shadow="never">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" label-position="left">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="任务标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="积分奖励" prop="pointReward">
              <el-input-number v-model="form.pointReward" :min="0" :step="10" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="截止时间">
          <el-date-picker
            v-model="form.deadline"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择截止时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input
            v-model="form.description"
            type="textarea"
            rows="4"
            placeholder="填写任务要求、示例"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-segmented v-model="form.status" :options="statusOptions" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{
            isEdit ? '保存修改' : '创建任务'
          }}</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
