/**
 * 前后端字段名映射
 * 后端返回数据库原始字段名（snake_case），前端统一使用简写（camelCase）。
 */
const studentsMap = {
  toFrontend: { student_id: 'id', student_name: 'name', gender: 'gender', age: 'age', major: 'major' },
  toBackend: { id: 'student_id', name: 'student_name', gender: 'gender', age: 'age', major: 'major' }
}

const coursesMap = {
  toFrontend: { course_id: 'id', course_name: 'name', credit: 'credit', hours: 'hours', teacher_name: 'teacher' },
  toBackend: { id: 'course_id', name: 'course_name', credit: 'credit', hours: 'hours', teacher: 'teacher_name' }
}

const gradesMap = {
  toFrontend: { grade_id: 'id', student_id: 'studentId', student_name: 'studentName', course_id: 'courseId', course_name: 'courseName', score: 'score' },
  toBackend: { id: 'grade_id', studentId: 'student_id', studentName: 'student_name', courseId: 'course_id', courseName: 'course_name', score: 'score' }
}

function transformItem(item, map) {
  const result = {}
  for (const [key, value] of Object.entries(item)) {
    result[map[key] || key] = value
  }
  return result
}

export function toFrontend(data, type) {
  const map = type === 'students' ? studentsMap.toFrontend
    : type === 'courses' ? coursesMap.toFrontend
    : type === 'grades' ? gradesMap.toFrontend : null
  if (!map || !data) return data
  if (Array.isArray(data)) return data.map(item => transformItem(item, map))
  return transformItem(data, map)
}

export function toBackend(data, type) {
  const map = type === 'students' ? studentsMap.toBackend
    : type === 'courses' ? coursesMap.toBackend
    : type === 'grades' ? gradesMap.toBackend : null
  if (!map || !data) return data
  if (Array.isArray(data)) return data.map(item => transformItem(item, map))
  return transformItem(data, map)
}
