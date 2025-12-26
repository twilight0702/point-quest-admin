<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

const props = defineProps<{ id?: string; mode?: 'create' | 'edit' }>()
const router = useRouter()
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  code: '',
  description: '',
  pointCost: 200,
  category: '',
  stock: 20,
  status: 'ON',
})

const isEdit = computed(() => !!props.id || props.mode === 'edit')

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  pointCost: [{ required: true, message: '请输入积分价格', trigger: 'blur' }],
}

onMounted(() => {
  if (isEdit.value) {
    form.name = '50元京东卡'
    form.code = 'JD50'
    form.description = '数字兑换码，发货后请妥善保存'
    form.pointCost = 500
    form.category = '礼品卡'
    form.stock = 15
    form.status = 'ON'
  }
})

const onSubmit = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
    router.push('/admin/rewards')
  })
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>{{ isEdit ? '编辑奖品' : '新建奖品' }}</h1>
      <el-button plain @click="router.back()">返回</el-button>
    </div>

    <el-card shadow="never">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" label-position="left">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="奖品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码">
              <el-input v-model="form.code" placeholder="可用于搜索" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="积分价格" prop="pointCost">
              <el-input-number v-model="form.pointCost" :min="0" :step="10" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="初始库存">
              <el-input-number v-model="form.stock" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="分类">
          <el-select v-model="form.category" placeholder="选择分类" clearable>
            <el-option label="礼品卡" value="giftcard" />
            <el-option label="周边" value="merch" />
            <el-option label="数字权益" value="digital" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            rows="4"
            placeholder="说明兑换方式、发货时间等"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-segmented v-model="form.status" :options="['ON', 'OFF']" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{
            isEdit ? '保存修改' : '创建奖品'
          }}</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
