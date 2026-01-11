<script setup lang="ts">
const stats = [
  { label: '待审核提交', value: '12', tone: 'primary' },
  { label: '本周通过', value: '48', tone: 'accent' },
  { label: '今日发放积分', value: '3,200', tone: 'warning' },
  { label: '库存预警', value: '3', tone: 'danger' },
]

const reminders = [
  { title: '2 条任务即将到期', time: '今天' },
  { title: '库存低于 10 的奖品需补货', time: '本周' },
  { title: '有 5 条未读站内消息', time: '刚刚' },
]

</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>概览</h1>
      <el-button type="primary" size="small" plain>刷新数据</el-button>
    </div>

    <div class="card-grid">
      <el-card v-for="item in stats" :key="item.label" shadow="hover" class="stat-card">
        <div class="stat-label">{{ item.label }}</div>
        <div class="stat-value" :class="item.tone">{{ item.value }}</div>
      </el-card>
    </div>

    <div class="section cards">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>提醒</span>
            <el-link type="primary" :underline="false">查看详情</el-link>
          </div>
        </template>
        <div class="timeline">
          <div v-for="item in reminders" :key="item.title" class="timeline-item">
            <div class="dot"></div>
            <div>
              <div class="title">{{ item.title }}</div>
              <div class="muted">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-card {
  border-radius: var(--radius-lg);
}

.stat-label {
  color: var(--color-text-muted);
  font-size: 13px;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
}

.stat-value.primary {
  color: var(--color-primary);
}

.stat-value.accent {
  color: var(--color-accent);
}

.stat-value.warning {
  color: var(--color-warning);
}

.stat-value.danger {
  color: var(--color-danger);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.timeline-item .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.15);
}
</style>
