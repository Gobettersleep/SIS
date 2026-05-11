const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const results = await query(
      'SELECT c.*, t.teacher_name, t.title AS teacher_title FROM courses c LEFT JOIN teachers t ON c.teacher_id = t.teacher_id'
    );
    const formattedResults = results.map(c => ({
      ...c,
      id: c.course_id,
      name: c.course_name,
      teacher: c.teacher_name || '',
      teacher_name: c.teacher_name || '',
      teacher_title: c.teacher_title || ''
    }));
    res.json(formattedResults);
  } catch (err) {
    console.error('获取课程列表失败:', err);
    res.status(500).json({ error: '获取课程列表失败' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const results = await query(
      'SELECT c.*, t.teacher_name, t.title AS teacher_title FROM courses c LEFT JOIN teachers t ON c.teacher_id = t.teacher_id WHERE c.course_id = ?', [id]
    );
    if (results.length === 0) {
      res.status(404).json({ error: '课程不存在' });
      return;
    }
    const course = results[0];
    res.json({ ...course, id: course.course_id, name: course.course_name, teacher: course.teacher_name || '', teacher_name: course.teacher_name || '', teacher_title: course.teacher_title || '' });
  } catch (err) {
    console.error('获取课程详情失败:', err);
    res.status(500).json({ error: '获取课程详情失败' });
  }
});

router.post('/', auth, async (req, res) => {
  const { course_id, course_name, credit, hours, teacher_id, teacher_name, department, semester, max_students, current_students, status, id, name, teacher } = req.body;
  const cid = course_id || id;
  const cname = course_name || name;
  const tid = teacher_id || null;
  try {
    await query(
      'INSERT INTO courses (course_id, course_name, credit, hours, teacher_id, department, semester, max_students, current_students, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [cid, cname, credit, hours, tid, department, semester, max_students || 60, current_students || 0, status || '正常']
    );
    res.json({ message: '课程添加成功' });
  } catch (err) {
    console.error('添加课程失败:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: `课程编号 ${cid} 已存在` });
    } else {
      res.status(500).json({ error: '添加课程失败' });
    }
  }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { course_name, credit, hours, teacher_id, department, semester, max_students, current_students, status } = req.body;
  try {
    const results = await query(
      'UPDATE courses SET course_name = ?, credit = ?, hours = ?, teacher_id = ?, department = ?, semester = ?, max_students = ?, current_students = ?, status = ? WHERE course_id = ?',
      [course_name, credit, hours, teacher_id, department, semester, max_students, current_students, status, id]
    );
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '课程不存在' });
      return;
    }
    res.json({ message: '课程更新成功' });
  } catch (err) {
    console.error('更新课程失败:', err);
    res.status(500).json({ error: '更新课程失败' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM course_enrollments WHERE course_id = ?', [id]);
    await query('DELETE FROM grades WHERE course_id = ?', [id]);
    const results = await query('DELETE FROM courses WHERE course_id = ?', [id]);
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '课程不存在' });
      return;
    }
    res.json({ message: '课程删除成功' });
  } catch (err) {
    console.error('删除课程失败:', err);
    res.status(500).json({ error: '删除课程失败' });
  }
});

// 选课管理 - 获取课程的学生列表
router.get('/:id/students', async (req, res) => {
  const { id } = req.params;
  try {
    const results = await query(
      'SELECT e.*, s.student_name, s.major, c.class_name FROM course_enrollments e JOIN students s ON e.student_id = s.student_id LEFT JOIN classes c ON s.class_id = c.class_id WHERE e.course_id = ?',
      [id]
    );
    const formattedResults = results.map(e => ({
      ...e,
      id: e.enrollment_id,
      studentId: e.student_id,
      studentName: e.student_name,
      major: e.major,
      className: e.class_name || ''
    }));
    res.json(formattedResults);
  } catch (err) {
    console.error('获取课程学生列表失败:', err);
    res.status(500).json({ error: '获取课程学生列表失败' });
  }
});

// 选课管理 - 添加学生到课程
router.post('/:id/enroll', auth, async (req, res) => {
  const { id } = req.params;
  const { student_id } = req.body;
  if (!student_id) {
    return res.status(400).json({ error: '学号不能为空' });
  }
  try {
    const studentResults = await query('SELECT * FROM students WHERE student_id = ?', [student_id]);
    if (studentResults.length === 0) {
      return res.status(404).json({ error: '学生不存在' });
    }
    const date = new Date().toISOString().split('T')[0];
    await query(
      'INSERT INTO course_enrollments (course_id, student_id, enrollment_date, status) VALUES (?, ?, ?, ?)',
      [id, student_id, date, '在读']
    );
    res.json({ message: '学生选课成功' });
  } catch (err) {
    console.error('选课失败:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: '该学生已选此课程' });
    } else {
      res.status(500).json({ error: '选课失败' });
    }
  }
});

// 选课管理 - 从课程移除学生
router.delete('/:id/enroll/:studentId', auth, async (req, res) => {
  const { id, studentId } = req.params;
  try {
    const results = await query(
      'DELETE FROM course_enrollments WHERE course_id = ? AND student_id = ?',
      [id, studentId]
    );
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '选课记录不存在' });
      return;
    }
    res.json({ message: '学生已从课程移除' });
  } catch (err) {
    console.error('移除选课失败:', err);
    res.status(500).json({ error: '移除选课失败' });
  }
});

module.exports = router;
