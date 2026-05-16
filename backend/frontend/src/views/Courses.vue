<template>
  <div class="courses-page">
    <div class="page-header">
      <div class="page-header-content"><h1 class="page-title">课程管理</h1><p class="page-subtitle">管理课程信息、学分设置与授课教师</p></div>
      <button class="add-button btn-primary" @click="openAddForm" :disabled="isLoading">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>添加课程</span>
      </button>
    </div>

    <div class="toolbar">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" v-model="searchQuery" placeholder="搜索课程名称、教师或课程ID..." class="search-input" />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''" aria-label="清空搜索"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="view-toggle">
        <button class="view-btn" :class="{ 'view-btn--active': viewMode === 'grid' }" @click="viewMode = 'grid'" title="卡片视图"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></button>
        <button class="view-btn" :class="{ 'view-btn--active': viewMode === 'list' }" @click="viewMode = 'list'" title="列表视图"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state"><div class="loading-content"><div class="spinner-large"></div><p>正在加载课程数据...</p></div></div>
    <div v-else-if="filteredCourses.length === 0" class="empty-state"><h3>未找到匹配的课程</h3><p>尝试调整搜索关键词或添加新课程</p></div>
    <div v-else-if="viewMode === 'grid'" class="courses-grid">
      <div v-for="course in paginatedCourses" :key="course.id" class="course-card">
        <div class="card-header">
          <div class="course-icon" :style="{ backgroundColor: getCourseColor(course.id) }">{{ course.name.charAt(0) }}</div>
          <div class="course-meta"><span class="course-id">{{ course.id }}</span><span class="credit-badge">{{ course.credit }} 学分</span></div>
        </div>
        <h3 class="course-name">{{ course.name }}</h3>
        <div class="course-info">
          <div class="info-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>{{ course.hours }} 课时</span></div>
          <div class="info-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>{{ course.teacher }}</span></div>
        </div>
        <div class="card-actions">
          <button class="action-btn action-edit" @click="editCourse(course)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>编辑</button>
          <button class="action-btn action-students" @click="openStudentManagement(course)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>管理学生</button>
          <button class="action-btn action-delete" @click="confirmDelete(course)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>删除</button>
        </div>
      </div>
    </div>
    <div v-else class="table-container"><div class="table-wrapper">
      <table class="data-table"><thead><tr>
        <th class="col-id" @click="sortBy('id')">课程ID<span class="sort-icon" :class="getSortClass('id')">↕</span></th>
        <th class="col-name" @click="sortBy('name')">课程名称<span class="sort-icon" :class="getSortClass('name')">↕</span></th>
        <th class="col-credit" @click="sortBy('credit')">学分<span class="sort-icon" :class="getSortClass('credit')">↕</span></th>
        <th class="col-hours">课时</th><th class="col-teacher">教师</th><th class="col-actions">操作</th>
      </tr></thead><tbody>
        <tr v-for="course in paginatedCourses" :key="course.id" class="table-row">
          <td class="col-id"><span class="id-badge">{{ course.id }}</span></td>
          <td class="col-name"><div class="name-cell"><div class="avatar-sm" :style="{ backgroundColor: getCourseColor(course.id) }">{{ course.name.charAt(0) }}</div><span>{{ course.name }}</span></div></td>
          <td class="col-credit"><span class="credit-badge">{{ course.credit }}</span></td>
          <td class="col-hours">{{ course.hours }} 课时</td><td class="col-teacher">{{ course.teacher }}</td>
          <td class="col-actions"><div class="action-group">
            <button class="action-btn action-edit" @click="editCourse(course)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
            <button class="action-btn action-students" @click="openStudentManagement(course)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></button>
            <button class="action-btn action-delete" @click="confirmDelete(course)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
          </div></td>
        </tr>
      </tbody></table>
    </div></div>

    <div v-if="filteredCourses.length > 0" class="pagination">
      <div class="pagination-info">共 {{ filteredCourses.length }} 条，第 {{ currentPage }}/{{ totalPages }} 页</div>
      <div class="pagination-controls">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
        <div class="page-numbers"><button v-for="page in visiblePages" :key="page" class="page-number" :class="{ 'page-number--active': page === currentPage }" @click="currentPage = page">{{ page }}</button></div>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">下一页</button>
      </div>
      <select v-model="pageSize" class="page-size"><option :value="6">6条/页</option><option :value="12">12条/页</option><option :value="24">24条/页</option></select>
    </div>

    <!-- 课程表单弹窗 -->
    <Teleport to="body"><Transition name="modal">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal-content" role="dialog" aria-modal="true">
          <div class="modal-header"><h3>{{ isEditing ? '编辑课程信息' : '添加新课程' }}</h3><button class="close-button" @click="closeForm" aria-label="关闭"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
          <form @submit.prevent="handleSubmit" class="modal-form">
            <div class="form-row">
              <div class="form-group" :class="{ 'form-group--error': formErrors.id }"><label class="form-label">课程ID<span class="required">*</span></label><input type="text" v-model="form.id" :disabled="isEditing" placeholder="如：C001" @blur="validateField('id')" /><p v-if="formErrors.id" class="error-text">{{ formErrors.id }}</p></div>
              <div class="form-group" :class="{ 'form-group--error': formErrors.name }"><label class="form-label">课程名称<span class="required">*</span></label><input type="text" v-model="form.name" placeholder="请输入课程名称" @blur="validateField('name')" /><p v-if="formErrors.name" class="error-text">{{ formErrors.name }}</p></div>
            </div>
            <div class="form-row">
              <div class="form-group" :class="{ 'form-group--error': formErrors.credit }"><label class="form-label">学分<span class="required">*</span></label><input type="number" v-model="form.credit" step="0.5" min="0.5" max="10" placeholder="如：3.0" @blur="validateField('credit')" /><p v-if="formErrors.credit" class="error-text">{{ formErrors.credit }}</p></div>
              <div class="form-group" :class="{ 'form-group--error': formErrors.hours }"><label class="form-label">课时<span class="required">*</span></label><input type="number" v-model="form.hours" min="1" max="200" placeholder="如：48" @blur="validateField('hours')" /><p v-if="formErrors.hours" class="error-text">{{ formErrors.hours }}</p></div>
            </div>
            <div class="form-group" :class="{ 'form-group--error': formErrors.teacher }"><label class="form-label">授课教师<span class="required">*</span></label>
              <select v-model="form.teacher" @change="validateField('teacher')">
                <option value="">请选择教师</option>
                <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.name }} ({{ t.title || '无职称' }} - {{ t.department || '' }})</option>
              </select>
              <p v-if="formErrors.teacher" class="error-text">{{ formErrors.teacher }}</p>
            </div>
            <div class="form-actions"><button type="button" class="btn-secondary" @click="closeForm">取消</button><button type="submit" class="btn-primary" :disabled="isSubmitting"><span v-if="isSubmitting" class="button-spinner"></span><span v-else>{{ isEditing ? '保存修改' : '确认添加' }}</span></button></div>
          </form>
        </div>
      </div>
    </Transition></Teleport>

    <!-- 删除确认弹窗 -->
    <Teleport to="body"><Transition name="modal">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
        <div class="modal-content modal-content--small" role="dialog" aria-modal="true">
          <div class="modal-header"><h3>确认删除</h3></div>
          <div class="modal-body"><p class="confirm-text">确定要删除课程 <strong>{{ courseToDelete?.name }}</strong>（{{ courseToDelete?.id }}）吗？</p><p class="confirm-hint">此操作不可撤销，相关数据将被永久删除。</p></div>
          <div class="form-actions"><button class="btn-secondary" @click="cancelDelete">取消</button><button class="btn-danger" @click="executeDelete" :disabled="isDeleting"><span v-if="isDeleting" class="button-spinner"></span><span v-else>确认删除</span></button></div>
        </div>
      </div>
    </Transition></Teleport>

    <!-- 管理学生弹窗 -->
    <Teleport to="body"><Transition name="modal">
      <div v-if="showStudentModal" class="modal-overlay" @click.self="closeStudentModal">
        <div class="modal-content modal-content--wide" role="dialog" aria-modal="true">
          <div class="modal-header"><h3>管理学生 - {{ selectedCourse?.name }}</h3><button class="close-button" @click="closeStudentModal" aria-label="关闭"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
          <div class="modal-body-student">
            <div class="enroll-form">
              <input type="text" v-model="newStudentId" placeholder="输入学号添加学生" class="enroll-input" @keyup.enter="enrollStudent" />
              <button class="btn-primary btn-sm" @click="enrollStudent" :disabled="isEnrolling"><span v-if="isEnrolling" class="button-spinner"></span><span v-else>添加</span></button>
            </div>
            <div v-if="isLoadingStudents" class="loading-small">加载中...</div>
            <div v-else-if="enrolledStudents.length === 0" class="empty-small">暂无学生选修此课程</div>
            <div v-else class="student-list">
              <div v-for="s in enrolledStudents" :key="s.studentId" class="student-row">
                <span class="student-id-badge">{{ s.studentId }}</span>
                <span class="student-name">{{ s.studentName }}</span>
                <span class="student-major">{{ s.major || '-' }}</span>
                <button class="btn-remove-sm" @click="removeStudent(s.studentId)" title="移除">移除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition></Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { get, post, put, del } from '../utils/api.js'
import { useToast } from '../composables/useToast.js'

const { success: ts, error: te } = useToast()
const courses = ref([])
const teachers = ref([])
const isLoading = ref(false); const isSubmitting = ref(false); const isDeleting = ref(false)
const viewMode = ref('grid')
const searchQuery = ref('')
const filteredCourses = computed(() => { if (!searchQuery.value.trim()) return courses.value; const q = searchQuery.value.toLowerCase(); return courses.value.filter(c => c.id?.toLowerCase().includes(q) || c.name?.toLowerCase().includes(q) || c.teacher?.toLowerCase().includes(q)) })
const sortField = ref(''); const sortDirection = ref('asc')
const sortedCourses = computed(() => { let r = [...filteredCourses.value]; if (sortField.value) { r.sort((a, b) => { let va = a[sortField.value], vb = b[sortField.value]; if (typeof va === 'string') va = va?.toLowerCase(); if (typeof vb === 'string') vb = vb?.toLowerCase(); if (va < vb) return sortDirection.value === 'asc' ? -1 : 1; if (va > vb) return sortDirection.value === 'asc' ? 1 : -1; return 0 }) } return r })
const sortBy = (field) => { if (sortField.value === field) sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'; else { sortField.value = field; sortDirection.value = 'asc' } }
const getSortClass = (f) => { if (sortField.value !== f) return ''; return sortDirection.value === 'asc' ? 'sort-asc' : 'sort-desc' }
const currentPage = ref(1); const pageSize = ref(6)
const totalPages = computed(() => Math.ceil(sortedCourses.value.length / pageSize.value) || 1)
const paginatedCourses = computed(() => { const s = (currentPage.value - 1) * pageSize.value; return sortedCourses.value.slice(s, s + pageSize.value) })
const visiblePages = computed(() => { const p = [], mv = 5; let s = Math.max(1, currentPage.value - Math.floor(mv / 2)), e = Math.min(totalPages.value, s + mv - 1); if (e - s + 1 < mv) s = Math.max(1, e - mv + 1); for (let i = s; i <= e; i++) p.push(i); return p })
watch([searchQuery, pageSize], () => { currentPage.value = 1 })

const fetchCourses = async () => { isLoading.value = true; try { const d = await get('/api/courses'); courses.value = Array.isArray(d) ? d : [] } catch (err) { te('加载课程数据失败'); courses.value = [] } finally { isLoading.value = false } }
const fetchTeachers = async () => { try { const d = await get('/api/teachers'); teachers.value = Array.isArray(d) ? d : [] } catch (err) { teachers.value = [] } }
onMounted(() => { fetchCourses(); fetchTeachers() })

const showForm = ref(false); const isEditing = ref(false)
const form = ref({ id: '', name: '', credit: '', hours: '', teacher: '' })
const formErrors = ref({})
const openAddForm = () => { isEditing.value = false; form.value = { id: '', name: '', credit: '', hours: '', teacher: '' }; formErrors.value = {}; showForm.value = true }
const editCourse = (c) => { isEditing.value = true; form.value = { ...c, teacher: c.teacherId || '' }; formErrors.value = {}; showForm.value = true }
const closeForm = () => { showForm.value = false; formErrors.value = {} }
const validateField = (field) => { const v = String(form.value[field] || '').trim(); if (!v) { const lb = { id: '课程ID', name: '课程名称', credit: '学分', hours: '课时', teacher: '授课教师' }; formErrors.value[field] = `${lb[field]}不能为空` } else { delete formErrors.value[field] } }
const validateForm = () => { ['id', 'name', 'credit', 'hours', 'teacher'].forEach(validateField); return Object.keys(formErrors.value).length === 0 }
const handleSubmit = async () => { if (!validateForm()) return; isSubmitting.value = true; try { const payload = { ...form.value, credit: Number(form.value.credit), hours: Number(form.value.hours) }; if (isEditing.value) { await put(`/api/courses/${form.value.id}`, payload); ts(`课程「${form.value.name}」已更新`) } else { await post('/api/courses', payload); ts(`课程「${form.value.name}」添加成功`) }; await fetchCourses(); closeForm() } catch (e) { te(e.message || '操作失败') } finally { isSubmitting.value = false } }
const showDeleteConfirm = ref(false); const courseToDelete = ref(null)
const confirmDelete = (c) => { courseToDelete.value = c; showDeleteConfirm.value = true }
const cancelDelete = () => { showDeleteConfirm.value = false; courseToDelete.value = null }
const executeDelete = async () => { if (!courseToDelete.value) return; isDeleting.value = true; try { await del(`/api/courses/${courseToDelete.value.id}`); ts('已删除'); await fetchCourses(); cancelDelete() } catch (e) { te(e.message || '删除失败') } finally { isDeleting.value = false } }

// 学生管理
const showStudentModal = ref(false); const selectedCourse = ref(null)
const enrolledStudents = ref([]); const newStudentId = ref('')
const isLoadingStudents = ref(false); const isEnrolling = ref(false)

const openStudentManagement = async (course) => {
  selectedCourse.value = course; showStudentModal.value = true; newStudentId.value = ''
  await fetchEnrolledStudents()
}
const closeStudentModal = () => { showStudentModal.value = false; selectedCourse.value = null; enrolledStudents.value = [] }

const fetchEnrolledStudents = async () => {
  if (!selectedCourse.value) return
  isLoadingStudents.value = true
  try { const d = await get(`/api/courses/${selectedCourse.value.id}/students`); enrolledStudents.value = Array.isArray(d) ? d : [] } catch (err) { te('加载学生列表失败') } finally { isLoadingStudents.value = false }
}

const enrollStudent = async () => {
  const sid = newStudentId.value.trim(); if (!sid) { te('请输入学号'); return }
  if (!selectedCourse.value) return
  isEnrolling.value = true
  try {
    await post(`/api/courses/${selectedCourse.value.id}/enroll`, { student_id: sid })
    ts('学生添加成功'); newStudentId.value = ''
    await fetchEnrolledStudents()
  } catch (err) { te(err.message || '添加失败') } finally { isEnrolling.value = false }
}

const removeStudent = async (studentId) => {
  if (!selectedCourse.value) return
  try {
    await del(`/api/courses/${selectedCourse.value.id}/enroll/${studentId}`)
    ts('学生已移除'); await fetchEnrolledStudents()
  } catch (err) { te(err.message || '移除失败') }
}

const cssColors = ['#4a6fa5', '#5a8f7b', '#c07a5a', '#8b6fae', '#5a9aa8', '#a85a6f']
const getCourseColor = (id) => { if (!id) return cssColors[0]; let h = 0; for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h); return cssColors[Math.abs(h) % cssColors.length] }
</script>

<style scoped>
.courses-page { padding: 1.5rem 0; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; } .page-header-content { flex: 1; }
.page-title { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.25rem 0; } .page-subtitle { font-size: 0.9rem; color: var(--text-secondary); margin: 0; }
.add-button { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; border: none; border-radius: 0.5rem; font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease; } .add-button:disabled { opacity: 0.6; cursor: not-allowed; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; }
.search-box { position: relative; flex: 1; max-width: 400px; } .search-icon { position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); pointer-events: none; }
.search-input { width: 100%; padding: 0.625rem 2.5rem; border: 1.5px solid var(--border-color); border-radius: 0.5rem; font-size: 0.9rem; background: var(--surface-color); color: var(--text-primary); transition: all 0.2s ease; } .search-input:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px var(--primary-light); }
.search-clear { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 0.25rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; } .search-clear:hover { background: var(--border-color); color: var(--text-primary); }
.view-toggle { display: flex; gap: 0.25rem; background: var(--surface-secondary); padding: 0.25rem; border-radius: 0.5rem; } .view-btn { display: flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border: none; background: transparent; color: var(--text-secondary); border-radius: 0.375rem; cursor: pointer; transition: all 0.2s ease; } .view-btn:hover { background: var(--surface-color); color: var(--text-primary); } .view-btn--active { background: var(--surface-color); color: var(--primary-color); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.loading-state { display: flex; justify-content: center; align-items: center; min-height: 300px; } .loading-content { text-align: center; color: var(--text-secondary); }
.spinner-large { width: 40px; height: 40px; border: 3px solid var(--border-color); border-top-color: var(--primary-color); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; } @keyframes spin { to { transform: rotate(360deg); } }
.empty-state { text-align: center; padding: 4rem 2rem; color: var(--text-secondary); } .empty-state h3 { font-size: 1.1rem; color: var(--text-primary); margin: 0 0 0.5rem 0; } .empty-state p { margin: 0; font-size: 0.9rem; }
.courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem; }
.course-card { background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1.25rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; } .course-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15); border-color: var(--primary-light); }
.card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.875rem; } .course-icon { width: 2.5rem; height: 2.5rem; border-radius: 0.625rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1rem; flex-shrink: 0; }
.course-meta { display: flex; flex-direction: column; gap: 0.125rem; flex: 1; } .course-id { font-size: 0.8rem; color: var(--text-tertiary); font-family: monospace; }
.credit-badge { display: inline-block; padding: 0.125rem 0.5rem; background: var(--primary-light); color: var(--primary-color); font-size: 0.75rem; font-weight: 600; border-radius: 999px; width: fit-content; }
.course-name { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin: 0 0 0.75rem 0; line-height: 1.3; }
.course-info { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; } .info-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary); } .info-item svg { color: var(--text-tertiary); flex-shrink: 0; }
.card-actions { display: flex; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color); flex-wrap: wrap; }
.table-container { background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 0.75rem; overflow: hidden; margin-bottom: 1.5rem; } .table-wrapper { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; } .data-table th, .data-table td { padding: 0.875rem 1rem; text-align: left; } .data-table th { background: var(--surface-secondary); font-weight: 600; color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; user-select: none; white-space: nowrap; } .data-table th:hover { color: var(--text-primary); } .sort-icon { margin-left: 0.25rem; opacity: 0.3; font-size: 0.75rem; } .sort-asc, .sort-desc { opacity: 1; color: var(--primary-color); } .data-table tbody tr { border-bottom: 1px solid var(--border-color); transition: background 0.15s ease; } .data-table tbody tr:hover { background: var(--surface-secondary); } .data-table tbody tr:last-child { border-bottom: none; }
.id-badge { display: inline-block; padding: 0.125rem 0.5rem; background: var(--surface-secondary); color: var(--text-secondary); font-size: 0.8rem; font-family: monospace; border-radius: 0.25rem; }
.name-cell { display: flex; align-items: center; gap: 0.625rem; } .avatar-sm { width: 1.75rem; height: 1.75rem; border-radius: 0.375rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem; font-weight: 600; flex-shrink: 0; }
.col-actions { width: 1px; white-space: nowrap; } .action-group { display: flex; gap: 0.375rem; }
.action-btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.75rem; border: 1px solid transparent; border-radius: 0.375rem; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; background: transparent; } .action-edit { color: var(--primary-color); border-color: var(--primary-light); } .action-edit:hover { background: var(--primary-light); } .action-delete { color: var(--danger-color); border-color: var(--danger-light); } .action-delete:hover { background: var(--danger-light); } .action-students { color: #059669; border-color: rgba(5, 150, 105, 0.2); } .action-students:hover { background: rgba(5, 150, 105, 0.1); }
.pagination { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding: 1rem 0; } .pagination-info { font-size: 0.85rem; color: var(--text-secondary); }
.pagination-controls { display: flex; align-items: center; gap: 0.375rem; }
.page-btn { padding: 0.5rem 0.875rem; border: 1px solid var(--border-color); background: var(--surface-color); color: var(--text-primary); border-radius: 0.375rem; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; } .page-btn:hover:not(:disabled) { border-color: var(--primary-color); color: var(--primary-color); } .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-numbers { display: flex; gap: 0.25rem; }
.page-number { width: 2.25rem; height: 2.25rem; display: flex; align-items: center; justify-content: center; border: 1px solid transparent; background: transparent; color: var(--text-secondary); border-radius: 0.375rem; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; } .page-number:hover { background: var(--surface-secondary); color: var(--text-primary); } .page-number--active { background: var(--primary-color); color: white; border-color: var(--primary-color); }
.page-size { margin-left: 0.5rem; padding: 0.5rem 1.75rem 0.5rem 0.75rem; border: 1px solid var(--border-color); border-radius: 0.375rem; background: var(--surface-color); color: var(--text-primary); font-size: 0.85rem; cursor: pointer; width: auto; }
.modal-overlay { position: fixed; inset: 0; background-color: #1a1a1a; display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 1000; }
.modal-content { background-color: #ffffff; border-radius: 0.75rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid #e0ddd8; } .modal-content--small { max-width: 400px; } .modal-content--wide { max-width: 560px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #eceae7; } .modal-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-primary); }
.close-button { background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 0.375rem; border-radius: 0.375rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; } .close-button:hover { background: #f7f5f2; color: var(--text-primary); }
.modal-form { padding: 1.5rem; } .modal-body { padding: 1.5rem; text-align: center; }
.modal-body-student { padding: 1.5rem; }
.confirm-text { font-size: 1rem; color: var(--text-primary); margin: 0 0 0.5rem 0; } .confirm-hint { font-size: 0.85rem; color: var(--text-secondary); margin: 0; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; } .form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.375rem; font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); } .form-group input, .form-group select { width: 100%; padding: 0.625rem 0.875rem; border: 1.5px solid var(--border-color); border-radius: 0.5rem; font-size: 0.9rem; background: var(--surface-color); color: var(--text-primary); transition: all 0.2s ease; box-sizing: border-box; } .form-group input:focus, .form-group select:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px var(--primary-light); } .form-group input:disabled { background: var(--surface-secondary); cursor: not-allowed; }
.required { color: var(--danger-color); } .error-text { font-size: 0.8rem; color: var(--danger-color); margin: 0.25rem 0 0 0; } .form-group--error input, .form-group--error select { border-color: var(--danger-color); } .form-group--error input:focus, .form-group--error select:focus { box-shadow: 0 0 0 3px var(--danger-light); }
.form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color); }

.enroll-form { display: flex; gap: 0.5rem; margin-bottom: 1rem; } .enroll-input { flex: 1; padding: 0.5rem 0.75rem; border: 1.5px solid var(--border-color); border-radius: 0.5rem; font-size: 0.9rem; } .enroll-input:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px var(--primary-light); }
.btn-sm { padding: 0.5rem 1rem; font-size: 0.85rem; }
.loading-small, .empty-small { text-align: center; padding: 2rem; color: var(--text-secondary); font-size: 0.9rem; }
.student-list { display: flex; flex-direction: column; gap: 0.5rem; max-height: 300px; overflow-y: auto; }
.student-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 0.75rem; background: var(--surface-secondary); border-radius: 0.5rem; } .student-id-badge { font-family: monospace; font-size: 0.8rem; background: var(--surface-color); padding: 0.125rem 0.5rem; border-radius: 0.25rem; } .student-name { font-weight: 500; flex: 1; } .student-major { font-size: 0.8rem; color: var(--text-secondary); }
.btn-remove-sm { padding: 0.25rem 0.75rem; border: 1px solid var(--danger-color); border-radius: 0.375rem; color: var(--danger-color); background: transparent; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; } .btn-remove-sm:hover { background: var(--danger-color); color: white; }

.btn-primary, .btn-secondary, .btn-danger { padding: 0.625rem 1.25rem; border: none; border-radius: 0.5rem; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 0.5rem; }
.btn-primary { background: var(--primary-color); color: white; } .btn-primary:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-1px); } .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { background: var(--surface-secondary); color: var(--text-primary); border: 1px solid var(--border-color); } .btn-secondary:hover { background: var(--border-color); }
.btn-danger { background: var(--danger-color); color: white; } .btn-danger:hover:not(:disabled) { background: #c0392b; transform: translateY(-1px); } .btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }
.button-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; }
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; } .modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96); }
@media (max-width: 768px) { .page-header { flex-direction: column; align-items: flex-start; } .toolbar { flex-direction: column; align-items: stretch; } .search-box { max-width: none; } .courses-grid { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } .pagination { flex-direction: column; align-items: center; } .data-table th, .data-table td { padding: 0.75rem 0.625rem; } .action-group { flex-direction: column; } }
@media (max-width: 480px) { .courses-page { padding: 1rem 0; } .page-title { font-size: 1.4rem; } .course-card { padding: 1rem; } .modal-content { margin: 0.5rem; } .modal-form, .modal-body { padding: 1rem; } }
</style>
