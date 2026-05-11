const { query } = require('../config/db');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '请先登录' });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [userId] = decoded.split(':');

    const results = await query('SELECT user_id, username, role FROM users WHERE user_id = ? AND status = "正常"', [userId]);

    if (results.length === 0) {
      return res.status(401).json({ error: '用户不存在或已被禁用' });
    }

    req.user = results[0];
    next();
  } catch (e) {
    return res.status(401).json({ error: '无效的登录凭证' });
  }
};

module.exports = authMiddleware;
