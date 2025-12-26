<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

const props = defineProps<{ id?: string; mode?: 'create' | 'edit' }>()
const router = useRouter()
const formRef = ref<FormInstance>()

const form = reactive({
  title: '',
  description: '',
  pointReward: 50,
  deadline: '',
  status: 'OPEN',
})

const isEdit = computed(() => !!props.id || props.mode === 'edit')

const rules: FormRules = {
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  pointReward: [{ required: true, message: '请输入积分奖励', trigger: 'blur' }],
}

onMounted(() => {
  if (isEdit.value) {
    // 预填充示例数据，实际可改为调用接口
    form.title = '每日签到截图'
    form.description = '上传今日签到截图用于审核'
    form.pointReward = 50
    form.deadline = '2025-01-01'
    form.status = 'OPEN'
  }
})

const onSubmit = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
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
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input
            v-model="form.description"
            type="textarea"
            rows="4"
            placeholder="补充任务要求、示例"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-segmented v-model="form.status" :options="['OPEN', 'CLOSED']" />
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
