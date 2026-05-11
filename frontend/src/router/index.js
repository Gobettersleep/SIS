import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/students',
    name: 'Students',
    component: () => import('../views/Students.vue')
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import('../views/Courses.vue')
  },
  {
    path: '/grades',
    name: 'Grades',
    component: () => import('../views/Grades.vue')
  },
  {
    path: '/teachers',
    name: 'Teachers',
    component: () => import('../views/Teachers.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
