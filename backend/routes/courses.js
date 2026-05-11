const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const results = await query('SELECT * FROM courses');
    const formattedResults = results.map(c => ({
      ...c,
      id: c.course_id,
      name: c.course_name,
      teacher: c.teacher_name
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
    const results = await query('SELECT * FROM courses WHERE course_id = ?', [id]);
    if (results.length === 0) {
      res.status(404).json({ error: '课程不存在' });
      return;
    }
    const course = results[0];
    res.json({ ...course, id: course.course_id, name: course.course_name, teacher: course.teacher_name });
  } catch (err) {
    console.error('获取课程详情失败:', err);
    res.status(500).json({ error: '获取课程详情失败' });
  }
});

router.post('/', async (req, res) => {
  const { course_id, course_name, credit, hours, teacher_name, teacher_title, department, semester, max_students, current_students, status, id, name, teacher } = req.body;
  const cid = course_id || id;
  const cname = course_name || name;
  const tname = teacher_name || teacher;
  try {
    await query(
      'INSERT INTO courses (course_id, course_name, credit, hours, teacher_name, teacher_title, department, semester, max_students, current_students, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [cid, cname, credit, hours, tname, teacher_title, department, semester, max_students || 60, current_students || 0, status || '正常']
    );
    res.json({ message: '课程添加成功' });
  } catch (err) {
    console.error('添加课程失败:', err);
    res.status(500).json({ error: '添加课程失败' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { course_name, credit, hours, teacher_name, teacher_title, department, semester, max_students, current_students, status } = req.body;
  try {
    const results = await query(
      'UPDATE courses SET course_name = ?, credit = ?, hours = ?, teacher_name = ?, teacher_title = ?, department = ?, semester = ?, max_students = ?, current_students = ?, status = ? WHERE course_id = ?',
      [course_name, credit, hours, teacher_name, teacher_title, department, semester, max_students, current_students, status, id]
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

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
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

module.exports = router;