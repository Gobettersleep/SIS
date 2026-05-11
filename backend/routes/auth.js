const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  try {
    const results = await query('SELECT * FROM users WHERE username = ? AND status = "正常"', [username]);

    if (results.length === 0) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const user = results[0];
    
    if (password !== user.password) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = Buffer.from(`${user.user_id}:${username}:${Date.now()}`).toString('base64');

    await query('UPDATE users SET last_login_time = NOW(), login_count = login_count + 1 WHERE user_id = ?', [user.user_id]);

    res.json({
      token,
      user: {
        userId: user.user_id,
        username: user.username,
        realName: user.real_name,
        role: user.role,
        email: user.email
      }
    });
  } catch (err) {
    console.error('登录查询失败:', err);
    return res.status(500).json({ error: '登录失败，请稍后重试' });
  }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: '用户名至少需要3个字符' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: '密码至少需要6个字符' });
  }

  try {
    const results = await query('SELECT * FROM users WHERE username = ?', [username]);

    if (results.length > 0) {
      return res.status(409).json({ error: '用户名已存在' });
    }

    await query('INSERT INTO users (username, password, real_name, role, status) VALUES (?, ?, ?, ?, ?)', [username, password, username, 'user', '正常']);

    res.json({ message: '注册成功' });
  } catch (err) {
    console.error('注册失败:', err);
    return res.status(500).json({ error: '注册失败，请稍后重试' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: '请填写完整信息' });
  }

  try {
    const results = await query('SELECT * FROM users WHERE username = ? AND email = ?', [username, email]);

    if (results.length === 0) {
      return res.status(404).json({ error: '用户不存在或邮箱不匹配' });
    }

    res.json({ message: '重置链接已发送至您的邮箱，请查收' });
  } catch (err) {
    console.error('找回密码查询失败:', err);
    return res.status(500).json({ error: '操作失败，请稍后重试' });
  }
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未授权' });
  }

  const token = authHeader.slice(7);
  
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [userId] = decoded.split(':');

    const results = await query('SELECT user_id, username, real_name, role, email, status FROM users WHERE user_id = ?', [userId]);

    if (results.length === 0) {
      return res.status(401).json({ error: '用户不存在' });
    }

    res.json(results[0]);
  } catch (e) {
    return res.status(401).json({ error: '无效的token' });
  }
});

module.exports = router;