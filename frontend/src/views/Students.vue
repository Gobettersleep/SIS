<template>
  <div class="students-page">
    <div class="page-header">
      <div class="page-header-content"><h1 class="page-title">学生管理</h1><p class="page-subtitle">管理学生信息、学籍状态与联系方式</p></div>
      <button class="add-button btn-primary" @click="openAddForm" :disabled="isLoading">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>添加学生</span>
      </button>
    </div>

    <div class="toolbar">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" v-model="searchQuery" placeholder="搜索学号、姓名或专业..." class="search-input" />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''" aria-label="清空搜索"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <button class="toolbar-btn" @click="refreshData" :disabled="isLoading" title="刷新数据">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'spinning': isLoading }"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
      </button>
    </div>

    <div class="table-container">
      <div v-if="isLoading" class="loading-overlay"><div class="loading-content"><div class="spinner-large"></div><p>正在加载学生数据...</p></div></div>
      <div v-else-if="filteredStudents.length === 0" class="empty-state"><h3>暂无学生数据</h3><p>点击添加学生开始录入信息</p></div>
      <div v-else class="table-wrapper">
        <table class="data-table"><thead><tr>
          <th class="col-id" @click="sortBy('id')">学号<span class="sort-icon" :class="getSortClass('id')">↕</span></th>
          <th class="col-name" @click="sortBy('name')">姓名<span class="sort-icon" :class="getSortClass('name')">↕</span></th>
          <th class="col-gender">性别</th>
          <th class="col-age" @click="sortBy('age')">年龄<span class="sort-icon" :class="getSortClass('age')">↕</span></th>
          <th class="col-major">专业</th>
          <th class="col-class">班级</th>
          <th class="col-actions">操作</th>
        </tr></thead>
        <tbody>
          <tr v-for="student in paginatedStudents" :key="student.id" class="table-row">
            <td class="col-id"><span class="id-badge">{{ student.id }}</span></td>
            <td class="col-name"><div class="name-cell"><div class="avatar" :style="{ backgroundColor: getAvatarColor(student.name) }">{{ student.name.charAt(0) }}</div><span class="name-text">{{ student.name }}</span></div></td>
            <td class="col-gender"><span class="gender-badge" :class="`gender-${student.gender}`">{{ student.gender }}</span></td>
            <td class="col-age">{{ student.age }} 岁</td>
            <td class="col-major"><span class="major-tag">{{ student.major }}</span></td>
            <td class="col-class"><span class="class-tag">{{ student.class_name || '-' }}</span></td>
            <td class="col-actions"><div class="action-group">
              <button class="action-btn action-edit" @click="editStudent(student)" title="编辑"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
              <button class="action-btn action-delete" @click="confirmDelete(student)" title="删除"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
            </div></td>
          </tr>
        </tbody></table>
      </div>
    </div>

    <div v-if="filteredStudents.length > 0" class="pagination">
      <div class="pagination-info">共 {{ filteredStudents.length }} 条，第 {{ currentPage }}/{{ totalPages }} 页</div>
      <div class="pagination-controls">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">上一页</button>
        <div class="page-numbers"><button v-for="page in visiblePages" :key="page" class="page-number" :class="{ 'page-number--active': page === currentPage }" @click="currentPage = page">{{ page }}</button></div>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">下一页</button>
      </div>
      <select v-model="pageSize" class="page-size"><option :value="5">5条/页</option><option :value="10">10条/页</option><option :value="20">20条/页</option></select>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
          <div class="modal-content" role="dialog" aria-modal="true">
            <div class="modal-header"><h3>{{ isEditing ? '编辑学生信息' : '添加新学生' }}</h3><button class="close-button" @click="closeForm" aria-label="关闭"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
            <form @submit.prevent="handleSubmit" class="modal-form">
              <div class="form-row">
                <div class="form-group" :class="{ 'form-group--error': formErrors.id }"><label class="form-label">学号<span class="required">*</span></label><input type="text" v-model="form.id" :disabled="isEditing" placeholder="如：2024001" @blur="validateField('id')" /><p v-if="formErrors.id" class="error-text">{{ formErrors.id }}</p></div>
                <div class="form-group" :class="{ 'form-group--error': formErrors.name }"><label class="form-label">姓名<span class="required">*</span></label><input type="text" v-model="form.name" placeholder="请输入姓名" @blur="validateField('name')" /><p v-if="formErrors.name" class="error-text">{{ formErrors.name }}</p></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label class="form-label">性别<span class="required">*</span></label><select v-model="form.gender"><option value="男">男</option><option value="女">女</option></select></div>
                <div class="form-group" :class="{ 'form-group--error': formErrors.age }"><label class="form-label">年龄<span class="required">*</span></label><input type="number" v-model="form.age" placeholder="请输入年龄" min="15" max="50" @blur="validateField('age')" /><p v-if="formErrors.age" class="error-text">{{ formErrors.age }}</p></div>
              </div>
              <div class="form-group" :class="{ 'form-group--error': formErrors.major }"><label class="form-label">专业<span class="required">*</span></label><input type="text" v-model="form.major" placeholder="请输入专业名称" @blur="validateField('major')" /><p v-if="formErrors.major" class="error-text">{{ formErrors.major }}</p></div>
              <div class="form-group"><label class="form-label">班级</label>
                <select v-model="form.classId">
                  <option value="">请选择班级</option>
                  <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="form-actions"><button type="button" class="btn-secondary" @click="closeForm">取消</button><button type="submit" class="btn-primary" :disabled="isSubmitting"><span v-if="isSubmitting" class="button-spinner"></span><span v-else>{{ isEditing ? '保存修改' : '确认添加' }}</span></button></div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
          <div class="modal-content modal-content--small" role="dialog" aria-modal="true">
            <div class="modal-header"><h3>确认删除</h3></div>
            <div class="modal-body"><p class="confirm-text">确定要删除学生 <strong>{{ studentToDelete?.name }}</strong>（{{ studentToDelete?.id }}）吗？</p><p class="confirm-hint">此操作不可撤销，相关数据将被永久删除。</p></div>
            <div class="form-actions"><button class="btn-secondary" @click="cancelDelete">取消</button><button class="btn-danger" @click="executeDelete" :disabled="isDeleting"><span v-if="isDeleting" class="button-spinner"></span><span v-else>确认删除</span></button></div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { get, post, put, del } from '../utils/api.js'
import { useToast } from '../composables/useToast.js'

const toast = useToast()
const students = ref([])
const classes = ref([])
const isLoading = ref(false); const isSubmitting = ref(false); const isDeleting = ref(false)
const searchQuery = ref(''); const currentPage = ref(1); const pageSize = ref(5)
const showForm = ref(false); const showDeleteConfirm = ref(false)
const studentToDelete = ref(null); const isEditing = ref(false)
const sortField = ref(''); const sortDirection = ref('asc')
const form = reactive({ id: '', name: '', gender: '男', age: '', major: '', classId: '' })
const formErrors = reactive({ id: '', name: '', age: '', major: '' })

const avatarColors = ['#2d5a7b', '#27ae60', '#d68910', '#c0392b', '#8e44ad', '#16a085']
const getAvatarColor = (name) => { let hash = 0; for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash); return avatarColors[Math.abs(hash) % avatarColors.length] }

const fetchStudents = async () => { isLoading.value = true; try { const data = await get('/api/students'); students.value = Array.isArray(data) ? data : [] } catch (err) { toast.error('加载学生数据失败'); students.value = [] } finally { isLoading.value = false } }
const fetchClasses = async () => { try { const data = await get('/api/classes'); classes.value = Array.isArray(data) ? data : [] } catch (err) { classes.value = [] } }
onMounted(() => { fetchStudents(); fetchClasses() })

const filteredStudents = computed(() => {
  let result = students.value
  if (searchQuery.value) { const q = searchQuery.value.toLowerCase(); result = result.filter(s => s.id?.toLowerCase().includes(q) || s.name?.toLowerCase().includes(q) || s.major?.toLowerCase().includes(q)) }
  if (sortField.value) { result = [...result].sort((a, b) => { const aV = a[sortField.value]; const bV = b[sortField.value]; return sortDirection.value === 'asc' ? (aV > bV ? 1 : -1) : (aV < bV ? 1 : -1) }) }
  return result
})
const totalPages = computed(() => Math.ceil(filteredStudents.value.length / pageSize.value) || 1)
const paginatedStudents = computed(() => { const start = (currentPage.value - 1) * pageSize.value; return filteredStudents.value.slice(start, start + pageSize.value) })
const visiblePages = computed(() => { const pages = [], mv = 5; let s = Math.max(1, currentPage.value - Math.floor(mv / 2)), e = Math.min(totalPages.value, s + mv - 1); if (e - s < mv - 1) s = Math.max(1, e - mv + 1); for (let i = s; i <= e; i++) pages.push(i); return pages })
watch([searchQuery, pageSize], () => { currentPage.value = 1 })

const sortBy = (field) => { if (sortField.value === field) sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'; else { sortField.value = field; sortDirection.value = 'asc' } }
const getSortClass = (field) => { if (sortField.value !== field) return ''; return sortDirection.value === 'asc' ? 'sort-asc' : 'sort-desc' }
const openAddForm = () => { isEditing.value = false; Object.assign(form, { id: '', name: '', gender: '男', age: '', major: '', classId: '' }); Object.keys(formErrors).forEach(k => formErrors[k] = ''); showForm.value = true }
const editStudent = (s) => { isEditing.value = true; Object.assign(form, { ...s, classId: s.class_id || '' }); showForm.value = true }
const closeForm = () => { showForm.value = false }
const validateField = (field) => {
  if (field === 'id') { if (!form.id.trim()) formErrors.id = '学号不能为空'; else if (!/^\d+$/.test(form.id)) formErrors.id = '学号必须为数字'; else formErrors.id = '' }
  if (field === 'name') { if (!form.name.trim()) formErrors.name = '姓名不能为空'; else if (form.name.length < 2) formErrors.name = '姓名至少2个字符'; else formErrors.name = '' }
  if (field === 'age') { if (!form.age) formErrors.age = '年龄不能为空'; else if (form.age < 15 || form.age > 50) formErrors.age = '年龄应在15-50之间'; else formErrors.age = '' }
  if (field === 'major') { if (!form.major.trim()) formErrors.major = '专业不能为空'; else formErrors.major = '' }
}
const handleSubmit = async () => { ['id','name','age','major'].forEach(validateField); if (Object.values(formErrors).some(e => e)) { toast.error('请修正表单中的错误'); return }; isSubmitting.value = true; try { const data = { ...form, age: Number(form.age), class_id: form.classId || null }; if (isEditing.value) { await put(`/api/students/${form.id}`, data); toast.success('信息已更新') } else { await post('/api/students', data); toast.success('添加成功') }; await fetchStudents(); closeForm() } catch (err) { toast.error(err.message || '操作失败') } finally { isSubmitting.value = false } }
const confirmDelete = (s) => { studentToDelete.value = s; showDeleteConfirm.value = true }
const cancelDelete = () => { showDeleteConfirm.value = false; studentToDelete.value = null }
const executeDelete = async () => { if (!studentToDelete.value) return; isDeleting.value = true; try { await del(`/api/students/${studentToDelete.value.id}`); toast.success('已删除'); await fetchStudents(); cancelDelete() } catch (err) { toast.error(err.message || '删除失败') } finally { isDeleting.value = false } }
const refreshData = async () => { await fetchStudents(); toast.success('数据已刷新') }
</script>

<style scoped>
.students-page { padding: var(--space-4) 0; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-6); gap: var(--space-4); }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: var(--space-1); }
.page-subtitle { color: var(--color-text-muted); font-size: 0.9375rem; }
.add-button { display: inline-flex; align-items: center; gap: var(--space-2); flex-shrink: 0; }
.toolbar { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4); }
.search-box { position: relative; flex: 1; max-width: 400px; }
.search-icon { position: absolute; left: var(--space-3); top: 50%; transform: translateY(-50%); color: var(--color-text-muted); pointer-events: none; }
.search-input { padding-left: 2.5rem; padding-right: 2rem; }
.search-clear { position: absolute; right: var(--space-2); top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--color-text-muted); cursor: pointer; padding: var(--space-1); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; min-height: auto; min-width: auto; }
.search-clear:hover { color: var(--color-text-primary); background-color: var(--color-surface-raised); transform: translateY(-50%); }
.toolbar-btn { background: none; border: 1px solid var(--color-border); color: var(--color-text-secondary); padding: var(--space-2); border-radius: var(--radius-md); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all var(--transition-fast); min-height: auto; min-width: auto; }
.toolbar-btn:hover { background-color: var(--color-surface-raised); border-color: var(--color-border-light); transform: none; }
.spinning { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }
.table-container { background-color: var(--color-surface); border-radius: var(--radius-lg); border: 1px solid var(--color-border-light); box-shadow: var(--shadow-sm); overflow: hidden; position: relative; min-height: 300px; }
.table-wrapper { overflow-x: auto; }
.data-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 0.9375rem; }
.data-table th { font-weight: 600; text-align: left; padding: var(--space-3) var(--space-4); color: var(--color-text-secondary); border-bottom: 2px solid var(--color-border); background-color: var(--color-surface-raised); white-space: nowrap; user-select: none; }
.data-table th.col-id, .data-table th.col-name, .data-table th.col-age { cursor: pointer; }
.data-table th.col-id:hover, .data-table th.col-name:hover, .data-table th.col-age:hover { background-color: var(--color-border-light); }
.sort-icon { margin-left: 4px; opacity: 0.3; font-size: 0.75rem; } .sort-asc, .sort-desc { opacity: 1; color: var(--color-accent); }
.data-table td { padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--color-border-light); vertical-align: middle; }
.table-row { transition: background-color var(--transition-fast); } .table-row:hover { background-color: var(--color-surface-raised); }
.id-badge { font-family: var(--font-mono); font-size: 0.875rem; color: var(--color-text-secondary); background-color: var(--color-surface-raised); padding: 2px 8px; border-radius: var(--radius-sm); }
.name-cell { display: flex; align-items: center; gap: var(--space-3); }
.avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.875rem; font-weight: 600; flex-shrink: 0; } .name-text { font-weight: 500; }
.gender-badge { display: inline-flex; padding: 2px 10px; border-radius: 100px; font-size: 0.8125rem; font-weight: 500; }
.gender-男 { background-color: rgba(45, 90, 123, 0.1); color: var(--color-accent); } .gender-女 { background-color: rgba(214, 137, 16, 0.1); color: var(--color-warning); }
.major-tag { font-size: 0.875rem; color: var(--color-text-secondary); }
.class-tag { font-size: 0.8125rem; color: var(--color-text-secondary); background-color: var(--color-surface-raised); padding: 2px 8px; border-radius: var(--radius-sm); }
.action-group { display: flex; gap: var(--space-1); }
.action-btn { width: 32px; height: 32px; border-radius: var(--radius-sm); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all var(--transition-fast); min-height: auto; min-width: auto; padding: 0; }
.action-btn:hover { transform: scale(1.1); } .action-edit { background-color: var(--color-accent-light); color: var(--color-accent); } .action-edit:hover { background-color: var(--color-accent); color: white; }
.action-delete { background-color: rgba(192, 57, 43, 0.1); color: var(--color-danger); } .action-delete:hover { background-color: var(--color-danger); color: white; }
.loading-overlay { position: absolute; inset: 0; background-color: var(--color-surface); display: flex; align-items: center; justify-content: center; z-index: 10; } .loading-content { text-align: center; color: var(--color-text-muted); }
.spinner-large { width: 40px; height: 40px; border: 3px solid var(--color-border); border-top-color: var(--color-accent); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto var(--space-3); }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-12) var(--space-6); text-align: center; } .empty-state h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-2); } .empty-state p { color: var(--color-text-muted); font-size: 0.9375rem; }
.pagination { display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-4); padding: var(--space-3) 0; gap: var(--space-4); flex-wrap: wrap; } .pagination-info { font-size: 0.875rem; color: var(--color-text-muted); }
.pagination-controls { display: flex; align-items: center; gap: var(--space-2); }
.page-btn { padding: var(--space-2) var(--space-3); background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-secondary); font-size: 0.875rem; cursor: pointer; transition: all var(--transition-fast); min-height: auto; } .page-btn:hover:not(:disabled) { background-color: var(--color-surface-raised); } .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-numbers { display: flex; gap: var(--space-1); }
.page-number { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-secondary); font-size: 0.875rem; cursor: pointer; transition: all var(--transition-fast); min-height: auto; padding: 0; } .page-number:hover { background-color: var(--color-surface-raised); }
.page-number--active { background-color: var(--color-accent); border-color: var(--color-accent); color: white; } .page-number--active:hover { background-color: var(--color-accent-hover); }
.page-size { margin-left: var(--space-2); padding: var(--space-2); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.875rem; width: auto; }
.modal-overlay { position: fixed; inset: 0; background-color: #1a1a1a; display: flex; align-items: center; justify-content: center; padding: var(--space-4); z-index: 2000; }
.modal-content { background-color: #ffffff; border-radius: var(--radius-lg); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; border: 1px solid #e0ddd8; } .modal-content--small { max-width: 400px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: var(--space-5) var(--space-6); border-bottom: 1px solid #eceae7; } .modal-header h3 { margin: 0; font-size: 1.125rem; font-weight: 600; }
.close-button { background: none; border: none; color: var(--color-text-muted); cursor: pointer; padding: var(--space-1); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; transition: all var(--transition-fast); min-height: auto; min-width: auto; } .close-button:hover { color: var(--color-text-primary); background-color: #f7f5f2; transform: none; }
.modal-form { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); } .modal-body { padding: var(--space-6); text-align: center; }
.confirm-text { font-size: 1rem; color: var(--color-text-primary); margin-bottom: var(--space-2); } .confirm-hint { font-size: 0.875rem; color: var(--color-text-muted); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.form-group { display: flex; flex-direction: column; gap: var(--space-2); } .form-group--error input, .form-group--error select { border-color: var(--color-danger); box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.1); }
.form-label { font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary); } .required { color: var(--color-danger); margin-left: 2px; } .error-text { font-size: 0.8125rem; color: var(--color-danger); }
.form-actions { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-2); }
.button-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
.modal-enter-active, .modal-leave-active { transition: opacity var(--transition-base); } .modal-enter-active .modal-content, .modal-leave-active .modal-content { transition: transform var(--transition-base), opacity var(--transition-base); } .modal-enter-from, .modal-leave-to { opacity: 0; } .modal-enter-from .modal-content, .modal-leave-to .modal-content { transform: scale(0.95) translateY(10px); opacity: 0; }
@media (max-width: 768px) { .page-header { flex-direction: column; align-items: stretch; } .add-button { width: 100%; justify-content: center; } .toolbar { flex-direction: column; align-items: stretch; } .search-box { max-width: none; } .pagination { flex-direction: column; align-items: center; } .form-row { grid-template-columns: 1fr; } }
</style>
