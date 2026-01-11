<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const formRef = ref<FormInstance>()
const form = reactive({
  title: '',
  content: '',
  receivers: [] as number[],
  broadcast: true,
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
}

const onSubmit = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
    ElMessage.success('已发送站内信')
  })
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>消息</h1>
    </div>
    <el-card shadow="never">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" label-position="left">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="公告或通知标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" rows="5" placeholder="输入站内信内容" />
        </el-form-item>
        <el-form-item label="发送范围">
          <el-radio-group v-model="form.broadcast">
            <el-radio-button :label="true">全体用户</el-radio-button>
            <el-radio-button :label="false">指定用户</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!form.broadcast" label="用户编号">
          <el-select
            v-model="form.receivers"
            multiple
            filterable
            placeholder="输入或选择用户编号"
            allow-create
          />
          <p class="muted">支持输入多个用户编号，按回车确认</p>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">发送</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
