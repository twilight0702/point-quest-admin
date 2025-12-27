import { createRouter, createWebHistory } from 'vue-router'
import { useAdminAuthStore } from '../stores/adminAuth'
import AdminLayout from '../layouts/AdminLayout.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import AdminTasks from '../views/admin/Tasks.vue'
import TaskForm from '../views/admin/TaskForm.vue'
import Submissions from '../views/admin/Submissions.vue'
import SubmissionDetail from '../views/admin/SubmissionDetail.vue'
import Rewards from '../views/admin/Rewards.vue'
import RewardForm from '../views/admin/RewardForm.vue'
import Pools from '../views/admin/Pools.vue'
import PoolForm from '../views/admin/PoolForm.vue'
import MessageSend from '../views/admin/MessageSend.vue'
import Orders from '../views/admin/Orders.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/admin' },
    {
      path: '/admin/login',
      name: 'AdminLogin',
      component: AdminLogin,
      meta: { public: true },
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', name: 'AdminDashboard', component: Dashboard },
        { path: 'tasks', name: 'AdminTasks', component: AdminTasks },
        { path: 'tasks/new', name: 'AdminTaskNew', component: TaskForm, props: { mode: 'create' } },
        { path: 'tasks/:taskNo/edit', name: 'AdminTaskEdit', component: TaskForm, props: true },
        { path: 'submissions', name: 'AdminSubmissions', component: Submissions },
        {
          path: 'submissions/:id',
          name: 'AdminSubmissionDetail',
          component: SubmissionDetail,
          props: true,
        },
        { path: 'rewards', name: 'AdminRewards', component: Rewards },
        {
          path: 'rewards/new',
          name: 'AdminRewardNew',
          component: RewardForm,
          props: { mode: 'create' },
        },
        { path: 'rewards/:id/edit', name: 'AdminRewardEdit', component: RewardForm, props: true },
        { path: 'pools', name: 'AdminPools', component: Pools },
        { path: 'pools/new', name: 'AdminPoolNew', component: PoolForm, props: { mode: 'create' } },
        { path: 'pools/:id/edit', name: 'AdminPoolEdit', component: PoolForm, props: true },
        { path: 'messages/send', name: 'AdminMessageSend', component: MessageSend },
        { path: 'orders', name: 'AdminOrders', component: Orders },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/admin' },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAdminAuthStore()
  await authStore.ensureSession()

  if (to.meta.public) {
    if (to.path === '/admin/login' && authStore.isAuthenticated) {
      return next('/admin')
    }
    return next()
  }

  if (to.path.startsWith('/admin')) {
    if (!authStore.isAuthenticated) {
      return next({ path: '/admin/login', query: { redirect: to.fullPath } })
    }
    if (authStore.me && authStore.me.role !== 'ADMIN') {
      return next({ path: '/admin/login', query: { redirect: to.fullPath } })
    }
  }

  return next()
})

export default router
