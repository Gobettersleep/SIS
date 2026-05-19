const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const results = await query('SELECT * FROM teachers');
    const formattedResults = results.map(t => ({
      ...t,
      id: t.teacher_id,
      name: t.teacher_name
    }));
    res.json(formattedResults);
  } catch (err) {
    console.error('获取教师列表失败:', err);
    res.status(500).json({ error: '获取教师列表失败' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const results = await query('SELECT * FROM teachers WHERE teacher_id = ?', [id]);
    if (results.length === 0) {
      res.status(404).json({ error: '教师不存在' });
      return;
    }
    const teacher = results[0];
    res.json({ ...teacher, id: teacher.teacher_id, name: teacher.teacher_name });
  } catch (err) {
    console.error('获取教师详情失败:', err);
    res.status(500).json({ error: '获取教师详情失败' });
  }
});

router.post('/', auth, async (req, res) => {
  const { teacher_id, teacher_name, gender, title, department, email, phone, status, id, name } = req.body;
  const tid = teacher_id || id;
  const tname = teacher_name || name;

  if (!tid || !tname) {
    return res.status(400).json({ error: '教师工号和姓名为必填项' });
  }

  try {
    await query(
      'INSERT INTO teachers (teacher_id, teacher_name, gender, title, department, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [tid, tname, gender || '男', title || null, department || null, email || null, phone || null, status || '在职']
    );
    res.json({ message: '教师添加成功' });
  } catch (err) {
    console.error('添加教师失败:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: `教师工号 ${tid} 已存在` });
    } else {
      res.status(500).json({ error: '添加教师失败' });
    }
  }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { teacher_name, gender, title, department, email, phone, status, name } = req.body;
  const tname = teacher_name || name || null;
  try {
    const results = await query(
      'UPDATE teachers SET teacher_name = ?, gender = ?, title = ?, department = ?, email = ?, phone = ?, status = ? WHERE teacher_id = ?',
      [tname, gender || null, title || null, department || null, email || null, phone || null, status || null, id]
    );
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '教师不存在' });
      return;
    }
    res.json({ message: '教师更新成功' });
  } catch (err) {
    console.error('更新教师失败:', err);
    res.status(500).json({ error: '更新教师失败' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await query('UPDATE courses SET teacher_id = NULL WHERE teacher_id = ?', [id]);
    const results = await query('DELETE FROM teachers WHERE teacher_id = ?', [id]);
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '教师不存在' });
      return;
    }
    res.json({ message: '教师删除成功' });
  } catch (err) {
    console.error('删除教师失败:', err);
    res.status(500).json({ error: '删除教师失败' });
  }
});

module.exports = router;
