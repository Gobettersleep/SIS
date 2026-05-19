const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const results = await query(
      'SELECT s.*, c.class_name FROM students s LEFT JOIN classes c ON s.class_id = c.class_id'
    );
    const formattedResults = results.map(s => ({
      ...s,
      id: s.student_id,
      name: s.student_name
    }));
    res.json(formattedResults);
  } catch (err) {
    console.error('获取学生列表失败:', err);
    res.status(500).json({ error: '获取学生列表失败' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const results = await query(
      'SELECT s.*, c.class_name FROM students s LEFT JOIN classes c ON s.class_id = c.class_id WHERE s.student_id = ?', [id]
    );
    if (results.length === 0) {
      res.status(404).json({ error: '学生不存在' });
      return;
    }
    const student = results[0];
    res.json({ ...student, id: student.student_id, name: student.student_name });
  } catch (err) {
    console.error('获取学生详情失败:', err);
    res.status(500).json({ error: '获取学生详情失败' });
  }
});

router.post('/', auth, async (req, res) => {
  const { student_id, student_name, gender, age, major, class_id, email, phone, address, enrollment_date, status, id, name } = req.body;

  const sid = student_id || id;
  const sname = student_name || name;

  if (!sid || !sname || !gender || !age || !major) {
    return res.status(400).json({ error: '学号、姓名、性别、年龄、专业为必填项' });
  }

  const date = enrollment_date || new Date().toISOString().split('T')[0];
  try {
    await query(
      'INSERT INTO students (student_id, student_name, gender, age, major, class_id, email, phone, address, enrollment_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [sid, sname, gender, age, major, class_id || null, email || null, phone || null, address || null, date, status || '在校']
    );
    res.json({ message: '学生添加成功' });
  } catch (err) {
    console.error('添加学生失败:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: `学号 ${sid} 已存在，请使用其他学号` });
    } else {
      res.status(500).json({ error: '添加学生失败' });
    }
  }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { student_name, gender, age, major, class_id, email, phone, address, status, name } = req.body;
  const sname = student_name || name || null;
  try {
    const results = await query(
      'UPDATE students SET student_name = ?, gender = ?, age = ?, major = ?, class_id = ?, email = ?, phone = ?, address = ?, status = ? WHERE student_id = ?',
      [sname, gender || null, age || null, major || null, class_id || null, email || null, phone || null, address || null, status || null, id]
    );
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '学生不存在' });
      return;
    }
    res.json({ message: '学生更新成功' });
  } catch (err) {
    console.error('更新学生失败:', err);
    res.status(500).json({ error: '更新学生失败' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  console.log(`[${new Date().toISOString()}] 收到删除学生请求, student_id: ${id}`);

  try {
    await query('DELETE FROM course_enrollments WHERE student_id = ?', [id]);
    await query('DELETE FROM grades WHERE student_id = ?', [id]);

    const results = await query('DELETE FROM students WHERE student_id = ?', [id]);
    if (results.affectedRows === 0) {
      console.log(`[${new Date().toISOString()}] 删除失败: 学生不存在, student_id: ${id}`);
      res.status(404).json({ error: '学生不存在' });
      return;
    }
    console.log(`[${new Date().toISOString()}] 学生删除成功, student_id: ${id}`);
    res.json({ message: '学生删除成功' });
  } catch (err) {
    console.error('删除学生失败:', err);
    res.status(500).json({ error: '删除学生失败' });
  }
});

module.exports = router;
