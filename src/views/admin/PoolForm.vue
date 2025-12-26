<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'

const props = defineProps<{ id?: string; mode?: 'create' | 'edit' }>()
const router = useRouter()
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  status: 'ON',
  dateRange: [] as string[],
  rewards: [] as number[],
})

const isEdit = computed(() => !!props.id || props.mode === 'edit')

onMounted(() => {
  if (isEdit.value) {
    form.name = '春节兑换池'
    form.status = 'ON'
    form.dateRange = ['2024-12-28', '2025-01-05']
    form.rewards = [11, 12]
  }
})

const onSubmit = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
    router.push('/admin/pools')
  })
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>{{ isEdit ? '编辑兑换池' : '新建兑换池' }}</h1>
      <el-button plain @click="router.back()">返回</el-button>
    </div>

    <el-card shadow="never">
      <el-form ref="formRef" :model="form" label-width="120px" label-position="left">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入名称' }]">
          <el-input v-model="form.name" placeholder="如：春节兑换池" />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="form.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="包含奖品">
          <el-select v-model="form.rewards" multiple placeholder="选择奖品" filterable>
            <el-option label="50元京东卡" :value="11" />
            <el-option label="运动水杯" :value="12" />
            <el-option label="会员月卡" :value="13" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-segmented v-model="form.status" :options="['ON', 'OFF']" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{
            isEdit ? '保存修改' : '创建兑换池'
          }}</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
