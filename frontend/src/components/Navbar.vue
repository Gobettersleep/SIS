<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="brand-link" aria-label="返回首页">
          <svg class="brand-logo" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
          </svg>
          <span class="brand-text">大学生信息系统</span>
        </router-link>
      </div>

      <button class="navbar-toggle" @click="isMenuOpen = !isMenuOpen" :aria-expanded="isMenuOpen" aria-controls="navbar-menu" aria-label="切换导航菜单">
        <span class="toggle-bar" :class="{ 'toggle-bar--open': isMenuOpen }"></span>
        <span class="toggle-bar" :class="{ 'toggle-bar--open': isMenuOpen }"></span>
        <span class="toggle-bar" :class="{ 'toggle-bar--open': isMenuOpen }"></span>
      </button>

      <div id="navbar-menu" class="navbar-links" :class="{ 'navbar-links--open': isMenuOpen }">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-link" :class="{ 'nav-link--active': $route.path === item.path }" @click="isMenuOpen = false">
          <svg v-if="item.path === '/students'" class="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <svg v-else-if="item.path === '/courses'" class="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <svg v-else-if="item.path === '/grades'" class="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
          <span class="nav-text">{{ item.label }}</span>
        </router-link>

        <router-link to="/login" class="nav-link nav-link--primary" :class="{ 'nav-link--active': $route.path === '/login' }" @click="isMenuOpen = false">
          <svg class="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span class="nav-text">登录</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)
const isScrolled = ref(false)

const navItems = [
  { path: '/students', label: '学生管理' },
  { path: '/courses', label: '课程管理' },
  { path: '/grades', label: '成绩管理' }
]

const handleScroll = () => { isScrolled.value = window.scrollY > 10 }
const handleResize = () => { if (window.innerWidth > 768) isMenuOpen.value = false }
const handleClickOutside = (event) => { const navbar = document.querySelector('.navbar'); if (navbar && !navbar.contains(event.target)) isMenuOpen.value = false }

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar { position: sticky; top: 0; z-index: 1000; background-color: #ffffff; border-bottom: 1px solid var(--color-border-light); transition: box-shadow var(--transition-base); margin-bottom: var(--space-8); }
.navbar--scrolled { box-shadow: var(--shadow-md); }
.navbar-container { max-width: 1280px; margin: 0 auto; padding: 0 var(--space-6); display: flex; justify-content: space-between; align-items: center; height: 64px; }
.navbar-brand { display: flex; align-items: center; flex-shrink: 0; }
.brand-link { display: flex; align-items: center; gap: var(--space-2); text-decoration: none; color: var(--color-text-primary); font-weight: 600; font-size: 1.125rem; transition: opacity var(--transition-fast); padding: var(--space-2) 0; }
.brand-link:hover { opacity: 0.8; }
.brand-logo { color: var(--color-accent); transition: transform var(--transition-bounce); flex-shrink: 0; }
.brand-link:hover .brand-logo { transform: rotate(-5deg) scale(1.1); }
.brand-text { letter-spacing: -0.01em; }
.navbar-links { display: flex; gap: var(--space-1); align-items: center; }
.nav-link { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-4); border-radius: var(--radius-md); color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500; transition: background-color var(--transition-fast), color var(--transition-fast), transform var(--transition-bounce); position: relative; min-height: 44px; }
.nav-link:hover { background-color: var(--color-accent-light); color: var(--color-accent); transform: translateY(-1px); }
.nav-link--active { background-color: var(--color-accent-light); color: var(--color-accent); }
.nav-link--active::after { content: ''; position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); width: 20px; height: 2px; background-color: var(--color-accent); border-radius: 1px; }
.nav-icon-svg { flex-shrink: 0; transition: transform var(--transition-bounce); }
.nav-link:hover .nav-icon-svg { transform: scale(1.15); }
.nav-link--primary { background-color: var(--color-accent); color: white; margin-left: var(--space-2); box-shadow: var(--shadow-sm); }
.nav-link--primary:hover { background-color: var(--color-accent-hover); color: white; box-shadow: var(--shadow-md); }
.nav-link--primary.nav-link--active { background-color: var(--color-accent-hover); color: white; }
.nav-link--primary.nav-link--active::after { display: none; }

.navbar-toggle { display: none; flex-direction: column; justify-content: center; align-items: center; width: 44px; height: 44px; padding: 0; background: none; border: none; cursor: pointer; gap: 5px; border-radius: var(--radius-md); transition: background-color var(--transition-fast); }
.navbar-toggle:hover { background-color: var(--color-accent-light); }
.toggle-bar { display: block; width: 22px; height: 2px; background-color: var(--color-text-primary); border-radius: 1px; transition: transform var(--transition-base), opacity var(--transition-base); }
.toggle-bar--open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.toggle-bar--open:nth-child(2) { opacity: 0; }
.toggle-bar--open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 768px) {
  .navbar-container { padding: 0 var(--space-4); height: 56px; }
  .navbar-toggle { display: flex; }
  .navbar-links { position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; background-color: #ffffff; padding: var(--space-4); gap: var(--space-2); border-bottom: 1px solid var(--color-border-light); box-shadow: var(--shadow-lg); opacity: 0; visibility: hidden; transform: translateY(-8px); transition: opacity var(--transition-base), visibility var(--transition-base), transform var(--transition-base); }
  .navbar-links--open { opacity: 1; visibility: visible; transform: translateY(0); }
  .nav-link { width: 100%; justify-content: flex-start; padding: var(--space-3) var(--space-4); }
  .nav-link--primary { margin-left: 0; margin-top: var(--space-2); justify-content: center; }
  .nav-link--active::after { left: var(--space-4); transform: none; }
}
@media (max-width: 480px) { .navbar-container { padding: 0 var(--space-3); } .brand-text { font-size: 1rem; } .brand-logo { width: 24px; height: 24px; } }
</style>
