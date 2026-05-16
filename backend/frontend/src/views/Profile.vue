<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">个人中心</h1>
      <p class="page-subtitle">查看和管理您的账户信息</p>
    </div>

    <div v-if="isLoading" class="loading-state"><div class="loading-content"><div class="spinner-large"></div><p>正在加载用户信息...</p></div></div>

    <div v-else-if="!isLoggedIn" class="not-logged-in">
      <div class="empty-card">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <h3>您尚未登录</h3>
        <p>请先登录以查看个人中心</p>
        <router-link to="/login" class="btn-primary">前往登录</router-link>
      </div>
    </div>

    <div v-else class="profile-content">
      <div class="profile-card">
        <div class="profile-avatar">
          <div class="avatar-large" :style="{ backgroundColor: avatarColor }">{{ userInitial }}</div>
          <h2 class="user-name">{{ user.realName || user.username }}</h2>
          <span class="user-role-badge" :class="`role-${user.role}`">{{ roleLabel }}</span>
        </div>

        <div class="info-list">
          <div class="info-item">
            <span class="info-label">用户名</span>
            <span class="info-value">{{ user.username }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">邮箱</span>
            <span class="info-value">{{ user.email || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">手机</span>
            <span class="info-value">{{ user.phone || '-' }}</span>
          </div>
        </div>

        <div class="profile-actions">
          <button class="btn-danger-outline" @click="handleLogout">退出登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '../utils/api.js'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const toast = useToast()
const isLoading = ref(true)
const user = ref({})

const isLoggedIn = computed(() => !!localStorage.getItem('auth_token'))

const avatarColor = computed(() => {
  const colors = ['#2d5a7b', '#27ae60', '#d68910', '#8e44ad', '#c0392b', '#16a085']
  const name = user.value.realName || user.value.username || '?'
  let hash = 0; for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
})

const userInitial = computed(() => {
  const name = user.value.realName || user.value.username || '?'
  return name.charAt(0).toUpperCase()
})

const roleLabel = computed(() => {
  const labels = { admin: '管理员', teacher: '教师', student: '学生', user: '普通用户' }
  return labels[user.value.role] || '普通用户'
})

const handleLogout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_info')
  toast.success('已退出登录')
  router.push('/')
}

onMounted(async () => {
  if (!isLoggedIn.value) { isLoading.value = false; return }
  try {
    const data = await get('/api/auth/me')
    user.value = data
    localStorage.setItem('user_info', JSON.stringify(data))
  } catch (err) {
    toast.error('获取用户信息失败')
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.profile-page { padding: var(--space-4) 0; max-width: 640px; margin: 0 auto; }
.page-header { margin-bottom: var(--space-8); text-align: center; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: var(--space-1); }
.page-subtitle { color: var(--color-text-muted); font-size: 0.9375rem; }

.loading-state { display: flex; justify-content: center; align-items: center; min-height: 300px; } .loading-content { text-align: center; color: var(--color-text-muted); }
.spinner-large { width: 40px; height: 40px; border: 3px solid var(--color-border); border-top-color: var(--color-accent); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; } @keyframes spin { to { transform: rotate(360deg); } }

.not-logged-in { display: flex; justify-content: center; }
.empty-card { text-align: center; padding: var(--space-12) var(--space-6); background: var(--color-surface); border-radius: var(--radius-lg); border: 1px solid var(--color-border-light); box-shadow: var(--shadow-sm); }
.empty-card svg { color: var(--color-text-muted); margin-bottom: var(--space-4); }
.empty-card h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-2); }
.empty-card p { color: var(--color-text-muted); margin-bottom: var(--space-6); }
.btn-primary { display: inline-flex; padding: 0.625rem 1.5rem; background: var(--color-accent); color: white; border-radius: var(--radius-md); text-decoration: none; font-weight: 500; font-size: 0.9375rem; transition: opacity 0.2s; } .btn-primary:hover { opacity: 0.9; }

.profile-card { background: var(--color-surface); border-radius: var(--radius-lg); border: 1px solid var(--color-border-light); box-shadow: var(--shadow-sm); overflow: hidden; }
.profile-avatar { display: flex; flex-direction: column; align-items: center; padding: var(--space-8) var(--space-6) var(--space-6); background: linear-gradient(135deg, #667eea0d 0%, #764ba20d 100%); }
.avatar-large { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: 700; margin-bottom: var(--space-4); }
.user-name { font-size: 1.375rem; font-weight: 600; margin-bottom: var(--space-2); color: var(--color-text-primary); }
.user-role-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 100px; font-size: 0.8125rem; font-weight: 500; }
.role-admin { background-color: rgba(45, 90, 123, 0.1); color: #2d5a7b; }
.role-teacher { background-color: rgba(39, 174, 96, 0.1); color: #059669; }
.role-student { background-color: rgba(214, 137, 16, 0.1); color: #d68910; }
.role-user { background-color: rgba(142, 68, 173, 0.1); color: #8e44ad; }

.info-list { padding: 0 var(--space-6); }
.info-item { padding: var(--space-4) 0; border-bottom: 1px solid var(--color-border-light); display: flex; justify-content: space-between; align-items: center; }
.info-item:last-child { border-bottom: none; }
.info-label { font-size: 0.8125rem; color: var(--color-text-muted); }
.info-value { font-size: 0.9375rem; font-weight: 500; color: var(--color-text-primary); }

.profile-actions { padding: var(--space-6); display: flex; justify-content: center; }
.btn-danger-outline { padding: 0.625rem 1.5rem; border: 1px solid var(--color-danger); border-radius: var(--radius-md); color: var(--color-danger); background: transparent; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; } .btn-danger-outline:hover { background: var(--color-danger); color: white; }

@media (max-width: 480px) { .info-list { padding: 0 var(--space-4); } }
</style>
