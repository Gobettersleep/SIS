import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Navbar from '../../src/components/Navbar.vue'

describe('Navbar', () => {
  let router
  let wrapper

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
        { path: '/students', name: 'Students', component: { template: '<div>Students</div>' } },
        { path: '/courses', name: 'Courses', component: { template: '<div>Courses</div>' } },
        { path: '/grades', name: 'Grades', component: { template: '<div>Grades</div>' } },
        { path: '/teachers', name: 'Teachers', component: { template: '<div>Teachers</div>' } },
        { path: '/login', name: 'Login', component: { template: '<div>Login</div>' } }
      ]
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('should render brand logo and text', async () => {
    await router.push('/')
    wrapper = mount(Navbar, { global: { plugins: [router] } })
    
    expect(wrapper.find('.brand-link').exists()).toBe(true)
    expect(wrapper.find('.brand-text').text()).toBe('大学生信息系统')
  })

  it('should display navigation links', async () => {
    await router.push('/')
    wrapper = mount(Navbar, { global: { plugins: [router] } })
    
    const navLinks = wrapper.findAll('.nav-link')
    expect(navLinks.length).toBeGreaterThanOrEqual(4)
    
    const linkTexts = navLinks.map(link => link.find('.nav-text').text())
    expect(linkTexts).toContain('学生管理')
    expect(linkTexts).toContain('课程管理')
    expect(linkTexts).toContain('成绩管理')
    expect(linkTexts).toContain('教师管理')
  })

  it('should highlight active route', async () => {
    await router.push('/students')
    wrapper = mount(Navbar, { global: { plugins: [router] } })
    
    const activeLink = wrapper.find('.nav-link--active')
    expect(activeLink.exists()).toBe(true)
    expect(activeLink.find('.nav-text').text()).toBe('学生管理')
  })

  it('should show login button when not logged in', async () => {
    await router.push('/')
    wrapper = mount(Navbar, { global: { plugins: [router] } })
    
    expect(wrapper.find('.admin-badge').exists()).toBe(false)
    expect(wrapper.find('.nav-link--primary').exists()).toBe(true)
    expect(wrapper.find('.nav-link--primary .nav-text').text()).toBe('登录')
  })

  it('should toggle mobile menu when clicking toggle button', async () => {
    await router.push('/')
    wrapper = mount(Navbar, { global: { plugins: [router] } })
    
    const toggleBtn = wrapper.find('.navbar-toggle')
    expect(toggleBtn.exists()).toBe(true)
    
    // Initially menu should be closed
    expect(wrapper.find('.navbar-links--open').exists()).toBe(false)
    
    // Click to open
    await toggleBtn.trigger('click')
    expect(wrapper.find('.navbar-links--open').exists()).toBe(true)
    
    // Click to close
    await toggleBtn.trigger('click')
    expect(wrapper.find('.navbar-links--open').exists()).toBe(false)
  })
})