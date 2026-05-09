<template>
  <div class="home">
    <section class="hero-section animate-fade-in-up">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>校园信息管理平台</span>
        </div>
        <h1 class="hero-title">高效管理学生信息<span class="hero-title-accent">提升教育管理水平</span></h1>
        <p class="hero-description">一站式学生信息管理系统，让教务工作更轻松、数据管理更规范、师生互动更便捷。</p>
        <div class="hero-actions">
          <router-link to="/students" class="hero-button btn-primary">
            <span>开始使用</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </router-link>
          <router-link to="/login" class="hero-button btn-secondary">登录账号</router-link>
        </div>
      </div>
      <div class="hero-decoration" aria-hidden="true">
        <div class="hero-shape hero-shape--1"></div>
        <div class="hero-shape hero-shape--2"></div>
        <div class="hero-shape hero-shape--3"></div>
      </div>
    </section>

    <section class="features-section">
      <div class="section-header"><h2 class="section-title">核心功能</h2><p class="section-subtitle">覆盖校园管理的方方面面</p></div>
      <div class="features-grid">
        <router-link v-for="(feature, index) in features" :key="feature.path" :to="feature.path" class="feature-card" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="feature-icon-wrapper" :style="{ backgroundColor: feature.iconBg }">
            <svg v-if="feature.path === '/students'" class="feature-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <svg v-else-if="feature.path === '/courses'" class="feature-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <svg v-else-if="feature.path === '/grades'" class="feature-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
            <svg v-else class="feature-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
          <div class="feature-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
        </router-link>
      </div>
    </section>

    <section class="stats-section">
      <div class="section-header"><h2 class="section-title">系统概览</h2><p class="section-subtitle">实时数据一目了然</p></div>
      <div v-if="isLoading" class="stats-loading">
        <div v-for="i in 4" :key="i" class="stat-skeleton">
          <div class="skeleton-icon"></div>
          <div class="skeleton-content"><div class="skeleton-value"></div><div class="skeleton-label"></div></div>
        </div>
      </div>
      <div v-else class="stats-grid">
        <div v-for="(stat, index) in stats" :key="stat.label" class="stat-card" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="stat-icon-wrapper" :style="{ backgroundColor: stat.iconBg }">
            <svg v-if="stat.icon === 'students'" class="stat-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <svg v-else-if="stat.icon === 'courses'" class="stat-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <svg v-else-if="stat.icon === 'grades'" class="stat-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <svg v-else class="stat-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="stat-content">
            <div class="stat-number"><span class="stat-value">{{ stat.displayValue }}</span><span class="stat-unit">{{ stat.unit }}</span></div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '../utils/api.js'
import { useToast } from '../composables/useToast.js'

const toast = useToast()

const features = [
  { path: '/students', iconBg: 'rgba(45, 90, 123, 0.1)', title: '学生管理', description: '记录和管理学生档案，包括基本信息、学籍状态和联系方式，一目了然。' },
  { path: '/courses', iconBg: 'rgba(39, 174, 96, 0.1)', title: '课程管理', description: '维护课程目录，涵盖课程详情、教师分配和课时安排，灵活调整教学计划。' },
  { path: '/grades', iconBg: 'rgba(214, 137, 16, 0.1)', title: '成绩管理', description: '记录和分析学生学业表现，生成成绩单与统计概览，支持多维度评估。' },
  { path: '/login', iconBg: 'rgba(192, 57, 43, 0.1)', title: '用户中心', description: '安全的身份认证与权限控制，个人资料管理，保障数据访问安全。' }
]

const isLoading = ref(true)
const stats = ref([
  { icon: 'students', iconBg: 'rgba(45, 90, 123, 0.1)', value: 0, displayValue: '-', unit: '人', label: '在校学生' },
  { icon: 'courses', iconBg: 'rgba(39, 174, 96, 0.1)', value: 0, displayValue: '-', unit: '门', label: '开设课程' },
  { icon: 'grades', iconBg: 'rgba(214, 137, 16, 0.1)', value: 0, displayValue: '-', unit: '条', label: '成绩记录' },
  { icon: 'teachers', iconBg: 'rgba(155, 89, 182, 0.1)', value: 0, displayValue: '-', unit: '位', label: '教师团队' }
])

const fetchStats = async () => {
  isLoading.value = true
  try {
    const [studentsRes, coursesRes, gradesRes] = await Promise.allSettled([
      get('/students').catch(() => []), get('/courses').catch(() => []), get('/grades').catch(() => [])
    ])
    const students = Array.isArray(studentsRes.value) ? studentsRes.value : []
    const courses = Array.isArray(coursesRes.value) ? coursesRes.value : []
    const grades = Array.isArray(gradesRes.value) ? gradesRes.value : []
    const teachers = new Set()
    students.forEach(s => { if (s.teacher) teachers.add(s.teacher) })
    stats.value = [
      { icon: 'students', iconBg: 'rgba(45, 90, 123, 0.1)', value: students.length, displayValue: students.length > 0 ? students.length.toLocaleString() : '-', unit: '人', label: '在校学生' },
      { icon: 'courses', iconBg: 'rgba(39, 174, 96, 0.1)', value: courses.length, displayValue: courses.length > 0 ? courses.length.toLocaleString() : '-', unit: '门', label: '开设课程' },
      { icon: 'grades', iconBg: 'rgba(214, 137, 16, 0.1)', value: grades.length, displayValue: grades.length > 0 ? grades.length.toLocaleString() : '-', unit: '条', label: '成绩记录' },
      { icon: 'teachers', iconBg: 'rgba(155, 89, 182, 0.1)', value: teachers.size, displayValue: teachers.size > 0 ? teachers.size.toLocaleString() : '-', unit: '位', label: '教师团队' }
    ]
  } catch (err) { toast.error('加载统计数据失败') } finally { isLoading.value = false }
}

onMounted(() => { fetchStats() })
</script>

<style scoped>
.home { padding: var(--space-4) 0; }
.hero-section { position: relative; padding: var(--space-16) var(--space-8); background-color: var(--color-surface); border-radius: var(--radius-lg); margin-bottom: var(--space-12); overflow: hidden; border: 1px solid var(--color-border-light); }
.hero-content { position: relative; z-index: 1; max-width: 600px; }
.hero-badge { display: inline-flex; align-items: center; gap: var(--space-2); padding: var(--space-1) var(--space-3); background-color: var(--color-accent-light); border-radius: 100px; font-size: 0.8125rem; font-weight: 500; color: var(--color-accent); margin-bottom: var(--space-5); }
.badge-dot { width: 6px; height: 6px; background-color: var(--color-accent); border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.hero-title { font-size: clamp(1.875rem, 5vw, 2.75rem); font-weight: 700; line-height: 1.2; margin-bottom: var(--space-4); color: var(--color-text-primary); }
.hero-title-accent { display: block; color: var(--color-accent); }
.hero-description { font-size: 1.0625rem; color: var(--color-text-secondary); margin-bottom: var(--space-8); max-width: 480px; line-height: 1.7; }
.hero-actions { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.hero-button { display: inline-flex; align-items: center; gap: var(--space-2); padding: var(--space-3) var(--space-6); font-size: 0.9375rem; font-weight: 600; text-decoration: none; border-radius: var(--radius-md); transition: all var(--transition-base); }
.hero-button svg { transition: transform var(--transition-fast); }
.hero-button:hover svg { transform: translateX(3px); }
.hero-decoration { position: absolute; top: 0; right: 0; width: 50%; height: 100%; pointer-events: none; }
.hero-shape { position: absolute; border-radius: 50%; opacity: 0.05; background: var(--color-accent); }
.hero-shape--1 { width: 300px; height: 300px; top: -80px; right: -60px; }
.hero-shape--2 { width: 200px; height: 200px; bottom: 40px; right: 80px; opacity: 0.03; }
.hero-shape--3 { width: 150px; height: 150px; top: 50%; right: 200px; opacity: 0.04; }
.section-header { margin-bottom: var(--space-8); }
.section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-2); }
.section-subtitle { color: var(--color-text-muted); font-size: 0.9375rem; }
.features-section { margin-bottom: var(--space-12); }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-4); }
.feature-card { background-color: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-6); border: 1px solid var(--color-border-light); box-shadow: var(--shadow-sm); text-decoration: none; color: inherit; transition: box-shadow var(--transition-base), transform var(--transition-base); position: relative; overflow: hidden; animation: fadeInUp 0.5s ease-out both; }
.feature-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); }
.feature-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--color-accent); transform: scaleX(0); transform-origin: left; transition: transform var(--transition-base); }
.feature-card:hover::before { transform: scaleX(1); }
.feature-icon-wrapper { width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-4); transition: transform var(--transition-bounce); }
.feature-card:hover .feature-icon-wrapper { transform: scale(1.1) rotate(-3deg); }
.feature-icon-svg { color: var(--color-accent); }
.feature-title { font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-2); color: var(--color-text-primary); }
.feature-description { font-size: 0.875rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: var(--space-4); }
.feature-arrow { color: var(--color-text-muted); transition: color var(--transition-fast), transform var(--transition-fast); }
.feature-card:hover .feature-arrow { color: var(--color-accent); transform: translateX(4px); }
.stats-section { margin-bottom: var(--space-8); }
.stats-loading { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-4); }
.stat-skeleton { background-color: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-5); border: 1px solid var(--color-border-light); display: flex; align-items: flex-start; gap: var(--space-4); }
.skeleton-icon { width: 44px; height: 44px; border-radius: var(--radius-md); background: linear-gradient(90deg, var(--color-border-light) 25%, var(--color-border) 50%, var(--color-border-light) 75%); background-size: 200% 100%; animation: skeleton-shimmer 1.5s ease-in-out infinite; }
.skeleton-content { flex: 1; display: flex; flex-direction: column; gap: var(--space-2); }
.skeleton-value { width: 80px; height: 28px; border-radius: var(--radius-sm); background: linear-gradient(90deg, var(--color-border-light) 25%, var(--color-border) 50%, var(--color-border-light) 75%); background-size: 200% 100%; animation: skeleton-shimmer 1.5s ease-in-out infinite; }
.skeleton-label { width: 60px; height: 14px; border-radius: var(--radius-sm); background: linear-gradient(90deg, var(--color-border-light) 25%, var(--color-border) 50%, var(--color-border-light) 75%); background-size: 200% 100%; animation: skeleton-shimmer 1.5s ease-in-out infinite; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-4); }
.stat-card { background-color: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-5); border: 1px solid var(--color-border-light); box-shadow: var(--shadow-sm); display: flex; align-items: flex-start; gap: var(--space-4); transition: box-shadow var(--transition-base); animation: fadeInUp 0.5s ease-out both; }
.stat-card:hover { box-shadow: var(--shadow-md); }
.stat-icon-wrapper { width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon-svg { color: var(--color-accent); }
.stat-content { flex: 1; }
.stat-number { display: flex; align-items: baseline; gap: var(--space-1); margin-bottom: var(--space-1); }
.stat-value { font-size: 1.75rem; font-weight: 700; color: var(--color-text-primary); line-height: 1.2; font-variant-numeric: tabular-nums; }
.stat-unit { font-size: 0.875rem; color: var(--color-text-muted); font-weight: 500; }
.stat-label { font-size: 0.875rem; color: var(--color-text-muted); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes skeleton-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@media (max-width: 768px) {
  .hero-section { padding: var(--space-10) var(--space-5); }
  .hero-actions { flex-direction: column; }
  .hero-button { width: 100%; justify-content: center; }
  .features-grid { grid-template-columns: 1fr; }
  .stats-grid, .stats-loading { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) { .stats-grid, .stats-loading { grid-template-columns: 1fr; } .stat-card { flex-direction: row; align-items: center; } }
</style>
