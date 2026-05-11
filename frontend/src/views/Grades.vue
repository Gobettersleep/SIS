<template>
  <div class="grades-page">
    <div class="page-header">
      <div class="page-header-content"><h1 class="page-title">成绩管理</h1><p class="page-subtitle">录入、查询与分析学生课程成绩</p></div>
      <button class="add-button btn-primary" @click="openAddForm" :disabled="isLoading">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>添加成绩</span>
      </button>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon" style="background:var(--primary-light);color:var(--primary-color);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div><div class="stat-info"><span class="stat-value">{{ stats.average }}</span><span class="stat-label">平均分</span></div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#fef3c7;color:#d97706;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><div class="stat-info"><span class="stat-value">{{ stats.highest }}</span><span class="stat-label">最高分</span></div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#fee2e2;color:#dc2626;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div><div class="stat-info"><span class="stat-value">{{ stats.lowest }}</span><span class="stat-label">最低分</span></div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#d1fae5;color:#059669;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><div class="stat-info"><span class="stat-value">{{ grades.length }}</span><span class="stat-label">总记录数</span></div></div>
    </div>

    <div class="toolbar">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" v-model="searchQuery" placeholder="搜索学号、姓名或课程..." class="search-input" />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''" aria-label="清空搜索"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <button class="toolbar-btn" @click="refreshData" :disabled="isLoading" title="刷新数据"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'spinning': isLoading }"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></button>
    </div>

    <div class="table-container">
      <div v-if="isLoading" class="loading-overlay"><div class="loading-content"><div class="spinner-large"></div><p>正在加载成绩数据...</p></div></div>
      <div v-else-if="filteredGrades.length === 0" class="empty-state"><h3>未找到匹配的成绩记录</h3><p>尝试调整搜索关键词或添加新成绩</p></div>
      <div v-else class="table-wrapper">
        <table class="data-table"><thead><tr>
          <th @click="sortBy('studentId')">学号<span class="sort-icon" :class="getSortClass('studentId')">↕</span></th>
          <th @click="sortBy('studentName')">姓名<span class="sort-icon" :class="getSortClass('studentName')">↕</span></th>
          <th @click="sortBy('courseName')">课程<span class="sort-icon" :class="getSortClass('courseName')">↕</span></th>
          <th @click="sortBy('score')">成绩<span class="sort-icon" :class="getSortClass('score')">↕</span></th>
          <th>等级</th><th>操作</th>
        </tr></thead><tbody>
          <tr v-for="grade in paginatedGrades" :key="grade.id" class="table-row">
            <td><span class="id-badge">{{ grade.studentId }}</span></td>
            <td><div class="name-cell"><div class="avatar-sm" :style="{ backgroundColor: getStudentColor(grade.studentName) }">{{ grade.studentName.charAt(0) }}</div><span>{{ grade.studentName }}</span></div></td>
            <td><div class="course-cell"><span class="course-name">{{ grade.courseName }}</span><span class="course-id">{{ grade.courseId }}</span></div></td>
            <td><div class="score-display"><span class="score-value" :class="getScoreClass(grade.score)">{{ grade.score }}</span><div class="score-bar"><div class="score-bar-fill" :style="{ width: grade.score + '%', backgroundColor: getScoreColor(grade.score) }"></div></div></div></td>
            <td><span class="grade-badge" :class="`grade-${getGradeLevel(grade.score)}`">{{ getGradeLabel(grade.score) }}</span></td>
            <td class="col-actions"><div class="action-group">
              <button class="action-btn action-edit" @click="editGrade(grade)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
              <button class="action-btn action-delete" @click="confirmDelete(grade)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
            </div></td>
          </tr>
        </tbody></table>
      </div>
    </div>

    <div v-if="filteredGrades.length > 0" class="pagination">
      <div class="pagination-info">共 {{ filteredGrades.length }} 条，第 {{ currentPage }}/{{ totalPages }} 页</div>
      <div class="pagination-controls">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
        <div class="page-numbers"><button v-for="page in visiblePages" :key="page" class="page-number" :class="{ 'page-number--active': page === currentPage }" @click="currentPage = page">{{ page }}</button></div>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">下一页</button>
      </div>
      <select v-model="pageSize" class="page-size"><option :value="5">5条/页</option><option :value="10">10条/页</option><option :value="20">20条/页</option></select>
    </div>

    <Teleport to="body"><Transition name="modal">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal-content" role="dialog" aria-modal="true">
          <div class="modal-header"><h3>{{ isEditing ? '编辑成绩' : '添加成绩' }}</h3><button class="close-button" @click="closeForm" aria-label="关闭"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
          <form @submit.prevent="handleSubmit" class="modal-form">
            <div class="form-row">
              <div class="form-group" :class="{ 'form-group--error': formErrors.studentId }"><label class="form-label">学号<span class="required">*</span></label><input type="text" v-model="form.studentId" :disabled="isEditing" placeholder="如：2021001" @blur="validateField('studentId')" /><p v-if="formErrors.studentId" class="error-text">{{ formErrors.studentId }}</p></div>
              <div class="form-group" :class="{ 'form-group--error': formErrors.studentName }"><label class="form-label">姓名<span class="required">*</span></label><input type="text" v-model="form.studentName" placeholder="请输入姓名" @blur="validateField('studentName')" /><p v-if="formErrors.studentName" class="error-text">{{ formErrors.studentName }}</p></div>
            </div>
            <div class="form-row">
              <div class="form-group" :class="{ 'form-group--error': formErrors.courseId }"><label class="form-label">课程ID<span class="required">*</span></label><input type="text" v-model="form.courseId" :disabled="isEditing" placeholder="如：C001" @blur="validateField('courseId')" /><p v-if="formErrors.courseId" class="error-text">{{ formErrors.courseId }}</p></div>
              <div class="form-group" :class="{ 'form-group--error': formErrors.courseName }"><label class="form-label">课程名称<span class="required">*</span></label><input type="text" v-model="form.courseName" placeholder="请输入课程名称" @blur="validateField('courseName')" /><p v-if="formErrors.courseName" class="error-text">{{ formErrors.courseName }}</p></div>
            </div>
            <div class="form-group" :class="{ 'form-group--error': formErrors.score }"><label class="form-label">成绩<span class="required">*</span></label><input type="number" v-model="form.score" min="0" max="100" step="0.5" placeholder="0-100" @blur="validateField('score')" /><p v-if="formErrors.score" class="error-text">{{ formErrors.score }}</p></div>
            <div class="form-actions"><button type="button" class="btn-secondary" @click="closeForm">取消</button><button type="submit" class="btn-primary" :disabled="isSubmitting"><span v-if="isSubmitting" class="button-spinner"></span><span v-else>{{ isEditing ? '保存修改' : '确认添加' }}</span></button></div>
          </form>
        </div>
      </div>
    </Transition></Teleport>

    <Teleport to="body"><Transition name="modal">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
        <div class="modal-content modal-content--small" role="dialog" aria-modal="true">
          <div class="modal-header"><h3>确认删除</h3></div>
          <div class="modal-body"><p class="confirm-text">确定要删除 <strong>{{ gradeToDelete?.studentName }}</strong> 的 <strong>{{ gradeToDelete?.courseName }}</strong> 成绩吗？</p><p class="confirm-hint">此操作不可撤销。</p></div>
          <div class="form-actions"><button class="btn-secondary" @click="cancelDelete">取消</button><button class="btn-danger" @click="executeDelete" :disabled="isDeleting"><span v-if="isDeleting" class="button-spinner"></span><span v-else>确认删除</span></button></div>
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
const grades = ref([])
const isLoading = ref(false); const isSubmitting = ref(false); const isDeleting = ref(false)

const fetchGrades = async () => { isLoading.value = true; try { const data = await get('/api/grades'); grades.value = Array.isArray(data) ? data : [] } catch (err) { te('加载成绩数据失败'); grades.value = [] } finally { isLoading.value = false } }
onMounted(() => { fetchGrades() })

const stats = computed(() => { if (grades.value.length === 0) return { average: '-', highest: '-', lowest: '-' }; const scores = grades.value.map(g => Number(g.score)); const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1); return { average: avg, highest: Math.max(...scores), lowest: Math.min(...scores) } })

const searchQuery = ref('')
const filteredGrades = computed(() => { if (!searchQuery.value.trim()) return grades.value; const q = searchQuery.value.toLowerCase(); return grades.value.filter(g => g.studentId?.toLowerCase().includes(q) || g.studentName?.toLowerCase().includes(q) || g.courseId?.toLowerCase().includes(q) || g.courseName?.toLowerCase().includes(q)) })

const sortField = ref(''); const sortDirection = ref('asc')
const sortedGrades = computed(() => { let r = [...filteredGrades.value]; if (sortField.value) { r.sort((a, b) => { let va = a[sortField.value], vb = b[sortField.value]; if (typeof va === 'string') va = va.toLowerCase(); if (typeof vb === 'string') vb = vb.toLowerCase(); if (va < vb) return sortDirection.value === 'asc' ? -1 : 1; if (va > vb) return sortDirection.value === 'asc' ? 1 : -1; return 0 }) } return r })
const sortBy = (f) => { if (sortField.value === f) sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'; else { sortField.value = f; sortDirection.value = 'asc' } }
const getSortClass = (f) => { if (sortField.value !== f) return ''; return sortDirection.value === 'asc' ? 'sort-asc' : 'sort-desc' }

const currentPage = ref(1); const pageSize = ref(5)
const totalPages = computed(() => Math.ceil(sortedGrades.value.length / pageSize.value) || 1)
const paginatedGrades = computed(() => { const s = (currentPage.value - 1) * pageSize.value; return sortedGrades.value.slice(s, s + pageSize.value) })
const visiblePages = computed(() => { const p = [], mv = 5; let s = Math.max(1, currentPage.value - Math.floor(mv / 2)), e = Math.min(totalPages.value, s + mv - 1); if (e - s + 1 < mv) s = Math.max(1, e - mv + 1); for (let i = s; i <= e; i++) p.push(i); return p })
watch([searchQuery, pageSize], () => { currentPage.value = 1 })

const getGradeLevel = (s) => { if (s >= 90) return 'excellent'; if (s >= 80) return 'good'; if (s >= 70) return 'average'; if (s >= 60) return 'pass'; return 'fail' }
const getGradeLabel = (s) => { if (s >= 90) return '优秀'; if (s >= 80) return '良好'; if (s >= 70) return '中等'; if (s >= 60) return '及格'; return '不及格' }
const getScoreClass = (s) => { if (s >= 90) return 'score-excellent'; if (s >= 80) return 'score-good'; if (s >= 70) return 'score-average'; if (s >= 60) return 'score-pass'; return 'score-fail' }
const getScoreColor = (s) => { if (s >= 90) return '#059669'; if (s >= 80) return '#4a6fa5'; if (s >= 70) return '#d97706'; if (s >= 60) return '#dc2626'; return '#991b1b' }
const studentColors = ['#4a6fa5', '#5a8f7b', '#c07a5a', '#8b6fae', '#5a9aa8', '#a85a6f']
const getStudentColor = (n) => { if (!n) return studentColors[0]; let h = 0; for (let i = 0; i < n.length; i++) h = n.charCodeAt(i) + ((h << 5) - h); return studentColors[Math.abs(h) % studentColors.length] }

const showForm = ref(false); const isEditing = ref(false)
const form = ref({ id: '', studentId: '', studentName: '', courseId: '', courseName: '', score: '' })
const formErrors = ref({})
const openAddForm = () => { isEditing.value = false; form.value = { id: '', studentId: '', studentName: '', courseId: '', courseName: '', score: '' }; formErrors.value = {}; showForm.value = true }
const editGrade = (g) => { isEditing.value = true; form.value = { ...g }; formErrors.value = {}; showForm.value = true }
const closeForm = () => { showForm.value = false; formErrors.value = {} }
const validateField = (f) => { const v = String(form.value[f] || '').trim(); if (!v && v !== '0') { const lb = { studentId: '学号', studentName: '姓名', courseId: '课程ID', courseName: '课程名称', score: '成绩' }; formErrors.value[f] = `${lb[f]}不能为空` } else { delete formErrors.value[f] } }
const validateForm = () => { ['studentId', 'studentName', 'courseId', 'courseName', 'score'].forEach(validateField); return Object.keys(formErrors.value).length === 0 }

const handleSubmit = async () => {
  if (!validateForm()) return; isSubmitting.value = true
  try {
    if (isEditing.value) { await put(`/api/grades/${form.value.id}`, { ...form.value }); ts('成绩已更新') }
    else { await post('/api/grades', { ...form.value }); ts('成绩添加成功') }
    await fetchGrades(); closeForm()
  } catch (e) { te(e.message || '操作失败') } finally { isSubmitting.value = false }
}

const showDeleteConfirm = ref(false); const gradeToDelete = ref(null)
const confirmDelete = (g) => { gradeToDelete.value = g; showDeleteConfirm.value = true }
const cancelDelete = () => { showDeleteConfirm.value = false; gradeToDelete.value = null }
const executeDelete = async () => { if (!gradeToDelete.value) return; isDeleting.value = true; try { await del(`/api/grades/${gradeToDelete.value.id}`); ts('成绩记录已删除'); await fetchGrades(); cancelDelete() } catch (e) { te(e.message || '删除失败') } finally { isDeleting.value = false } }
const refreshData = async () => { await fetchGrades(); ts('数据已刷新') }
</script>

<style scoped>
.grades-page { padding: 1.5rem 0; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; } .page-header-content { flex: 1; }
.page-title { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.25rem 0; } .page-subtitle { font-size: 0.9rem; color: var(--text-secondary); margin: 0; }
.add-button { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; border: none; border-radius: 0.5rem; font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease; } .add-button:disabled { opacity: 0.6; cursor: not-allowed; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
.stat-card { background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 0.875rem; transition: all 0.2s ease; } .stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.stat-icon { width: 2.5rem; height: 2.5rem; border-radius: 0.625rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-info { display: flex; flex-direction: column; } .stat-value { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); line-height: 1.2; } .stat-label { font-size: 0.8rem; color: var(--text-secondary); }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; gap: 1rem; flex-wrap: wrap; }
.search-box { position: relative; flex: 1; max-width: 400px; } .search-icon { position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); pointer-events: none; }
.search-input { width: 100%; padding: 0.625rem 2.5rem; border: 1.5px solid var(--border-color); border-radius: 0.5rem; font-size: 0.9rem; background: var(--surface-color); color: var(--text-primary); transition: all 0.2s ease; } .search-input:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px var(--primary-light); }
.search-clear { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 0.25rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; } .search-clear:hover { background: var(--border-color); color: var(--text-primary); }
.toolbar-btn { display: flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border: 1px solid var(--border-color); background: var(--surface-color); color: var(--text-secondary); border-radius: 0.5rem; cursor: pointer; transition: all 0.2s ease; } .toolbar-btn:hover:not(:disabled) { border-color: var(--primary-color); color: var(--primary-color); } .toolbar-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.spinning { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }
.table-container { background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 0.75rem; overflow: hidden; margin-bottom: 1rem; position: relative; min-height: 200px; } .table-wrapper { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; } .data-table th, .data-table td { padding: 0.875rem 1rem; text-align: left; } .data-table th { background: var(--surface-secondary); font-weight: 600; color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; user-select: none; white-space: nowrap; } .data-table th:hover { color: var(--text-primary); }
.sort-icon { margin-left: 0.25rem; opacity: 0.3; font-size: 0.75rem; } .sort-asc, .sort-desc { opacity: 1; color: var(--primary-color); }
.data-table tbody tr { border-bottom: 1px solid var(--border-color); transition: background 0.15s ease; } .data-table tbody tr:hover { background: var(--surface-secondary); } .data-table tbody tr:last-child { border-bottom: none; }
.id-badge { display: inline-block; padding: 0.125rem 0.5rem; background: var(--surface-secondary); color: var(--text-secondary); font-size: 0.8rem; font-family: monospace; border-radius: 0.25rem; }
.name-cell { display: flex; align-items: center; gap: 0.625rem; } .avatar-sm { width: 1.75rem; height: 1.75rem; border-radius: 0.375rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem; font-weight: 600; flex-shrink: 0; }
.course-cell { display: flex; flex-direction: column; gap: 0.125rem; } .course-name { color: var(--text-primary); font-weight: 500; } .course-id { font-size: 0.75rem; color: var(--text-tertiary); font-family: monospace; }
.score-display { display: flex; flex-direction: column; gap: 0.25rem; min-width: 80px; } .score-value { font-weight: 700; font-size: 1rem; } .score-excellent { color: #059669; } .score-good { color: #4a6fa5; } .score-average { color: #d97706; } .score-pass { color: #dc2626; } .score-fail { color: #991b1b; }
.score-bar { height: 0.25rem; background: var(--surface-secondary); border-radius: 999px; overflow: hidden; } .score-bar-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }
.grade-badge { display: inline-block; padding: 0.25rem 0.625rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600; } .grade-excellent { background: #d1fae5; color: #059669; } .grade-good { background: #dbeafe; color: #4a6fa5; } .grade-average { background: #fef3c7; color: #d97706; } .grade-pass { background: #fee2e2; color: #dc2626; } .grade-fail { background: #fecaca; color: #991b1b; }
.col-actions { width: 1px; white-space: nowrap; } .action-group { display: flex; gap: 0.375rem; }
.action-btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.75rem; border: 1px solid transparent; border-radius: 0.375rem; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; background: transparent; } .action-edit { color: var(--primary-color); border-color: var(--primary-light); } .action-edit:hover { background: var(--primary-light); } .action-delete { color: var(--danger-color); border-color: var(--danger-light); } .action-delete:hover { background: var(--danger-light); }
.loading-overlay { display: flex; justify-content: center; align-items: center; min-height: 200px; } .loading-content { text-align: center; color: var(--text-secondary); }
.spinner-large { width: 40px; height: 40px; border: 3px solid var(--border-color); border-top-color: var(--primary-color); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
.empty-state { text-align: center; padding: 4rem 2rem; color: var(--text-secondary); } .empty-state h3 { font-size: 1.1rem; color: var(--text-primary); margin: 0 0 0.5rem 0; } .empty-state p { margin: 0; font-size: 0.9rem; }
.pagination { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding: 1rem 0; } .pagination-info { font-size: 0.85rem; color: var(--text-secondary); } .pagination-controls { display: flex; align-items: center; gap: 0.375rem; }
.page-btn { padding: 0.5rem 0.875rem; border: 1px solid var(--border-color); background: var(--surface-color); color: var(--text-primary); border-radius: 0.375rem; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; } .page-btn:hover:not(:disabled) { border-color: var(--primary-color); color: var(--primary-color); } .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-numbers { display: flex; gap: 0.25rem; }
.page-number { width: 2.25rem; height: 2.25rem; display: flex; align-items: center; justify-content: center; border: 1px solid transparent; background: transparent; color: var(--text-secondary); border-radius: 0.375rem; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; } .page-number:hover { background: var(--surface-secondary); color: var(--text-primary); } .page-number--active { background: var(--primary-color); color: white; border-color: var(--primary-color); }
.page-size { margin-left: 0.5rem; padding: 0.5rem 1.75rem 0.5rem 0.75rem; border: 1px solid var(--border-color); border-radius: 0.375rem; background: var(--surface-color); color: var(--text-primary); font-size: 0.85rem; cursor: pointer; width: auto; }
.modal-overlay { position: fixed; inset: 0; background-color: #1a1a1a; display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 1000; }
.modal-content { background-color: #ffffff; border-radius: var(--radius-lg); width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid #e0ddd8; } .modal-content--small { max-width: 400px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #eceae7; } .modal-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-primary); }
.close-button { background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 0.375rem; border-radius: 0.375rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; } .close-button:hover { background: #f7f5f2; color: var(--text-primary); }
.modal-form { padding: 1.5rem; } .modal-body { padding: 1.5rem; text-align: center; }
.confirm-text { font-size: 1rem; color: var(--text-primary); margin: 0 0 0.5rem 0; } .confirm-hint { font-size: 0.85rem; color: var(--text-secondary); margin: 0; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; } .form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.375rem; font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); } .form-group input, .form-group select { width: 100%; padding: 0.625rem 0.875rem; border: 1.5px solid var(--border-color); border-radius: 0.5rem; font-size: 0.9rem; background: var(--surface-color); color: var(--text-primary); transition: all 0.2s ease; box-sizing: border-box; } .form-group input:focus, .form-group select:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px var(--primary-light); } .form-group input:disabled { background: var(--surface-secondary); cursor: not-allowed; }
.required { color: var(--danger-color); } .error-text { font-size: 0.8rem; color: var(--danger-color); margin: 0.25rem 0 0 0; } .form-group--error input, .form-group--error select { border-color: var(--danger-color); }
.form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color); }
.btn-primary, .btn-secondary, .btn-danger { padding: 0.625rem 1.25rem; border: none; border-radius: 0.5rem; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 0.5rem; }
.btn-primary { background: var(--primary-color); color: white; } .btn-primary:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-1px); } .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { background: var(--surface-secondary); color: var(--text-primary); border: 1px solid var(--border-color); } .btn-secondary:hover { background: var(--border-color); }
.btn-danger { background: var(--danger-color); color: white; } .btn-danger:hover:not(:disabled) { background: #c0392b; transform: translateY(-1px); } .btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }
.button-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; }
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; } .modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96); }
@media (max-width: 768px) { .page-header { flex-direction: column; align-items: flex-start; } .stats-grid { grid-template-columns: repeat(2, 1fr); } .toolbar { flex-direction: column; align-items: stretch; } .search-box { max-width: none; } .form-row { grid-template-columns: 1fr; } .pagination { flex-direction: column; align-items: center; } .data-table th, .data-table td { padding: 0.75rem 0.625rem; } .action-group { flex-direction: column; } }
@media (max-width: 480px) { .grades-page { padding: 1rem 0; } .page-title { font-size: 1.4rem; } .stats-grid { grid-template-columns: 1fr 1fr; } .stat-card { padding: 0.75rem; } .modal-content { margin: 0.5rem; } .modal-form, .modal-body { padding: 1rem; } }
</style>
