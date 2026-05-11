const studentsMap = {
  toFrontend: { student_id: 'id', student_name: 'name', gender: 'gender', age: 'age', major: 'major', class_id: 'classId', class_name: 'className' },
  toBackend: { id: 'student_id', name: 'student_name', gender: 'gender', age: 'age', major: 'major', classId: 'class_id', className: 'class_name' }
}

const coursesMap = {
  toFrontend: { course_id: 'id', course_name: 'name', credit: 'credit', hours: 'hours', teacher_id: 'teacherId', teacher_name: 'teacher', teacher_title: 'teacherTitle' },
  toBackend: { id: 'course_id', name: 'course_name', credit: 'credit', hours: 'hours', teacherId: 'teacher_id', teacher: 'teacher_id', teacherTitle: 'teacher_title' }
}

const gradesMap = {
  toFrontend: { grade_id: 'id', student_id: 'studentId', student_name: 'studentName', course_id: 'courseId', course_name: 'courseName', score: 'score' },
  toBackend: { id: 'grade_id', studentId: 'student_id', studentName: 'student_name', courseId: 'course_id', courseName: 'course_name', score: 'score' }
}

const teachersMap = {
  toFrontend: { teacher_id: 'id', teacher_name: 'name', gender: 'gender', title: 'title', department: 'department', email: 'email', phone: 'phone', status: 'status' },
  toBackend: { id: 'teacher_id', name: 'teacher_name', gender: 'gender', title: 'title', department: 'department', email: 'email', phone: 'phone', status: 'status' }
}

const classesMap = {
  toFrontend: { class_id: 'id', class_name: 'name', major: 'major', grade_level: 'gradeLevel' },
  toBackend: { id: 'class_id', name: 'class_name', major: 'major', gradeLevel: 'grade_level' }
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
    : type === 'grades' ? gradesMap.toFrontend
    : type === 'teachers' ? teachersMap.toFrontend
    : type === 'classes' ? classesMap.toFrontend : null
  if (!map || !data) return data
  if (Array.isArray(data)) return data.map(item => transformItem(item, map))
  return transformItem(data, map)
}

export function toBackend(data, type) {
  const map = type === 'students' ? studentsMap.toBackend
    : type === 'courses' ? coursesMap.toBackend
    : type === 'grades' ? gradesMap.toBackend
    : type === 'teachers' ? teachersMap.toBackend
    : type === 'classes' ? classesMap.toBackend : null
  if (!map || !data) return data
  if (Array.isArray(data)) return data.map(item => transformItem(item, map))
  return transformItem(data, map)
}
