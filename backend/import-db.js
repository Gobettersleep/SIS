require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'college_info_system';

async function importDatabase() {
  console.log('[信息] 正在连接 MySQL...');
  console.log(`  主机: ${DB_HOST}, 用户: ${DB_USER}`);

  let connection;
  try {
    // 先连接 MySQL（不指定数据库）
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      multipleStatements: true,
      charset: 'utf8mb4'
    });

    console.log('[成功] MySQL 连接成功');

    // 读取 SQL 文件
    const sqlPath = path.join(__dirname, 'config', 'database.sql');
    console.log(`[信息] 读取 SQL 文件: ${sqlPath}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // 执行 SQL
    console.log('[信息] 正在执行 SQL 脚本，请稍候...');
    await connection.query(sql);

    console.log('[成功] 数据库初始化完成！');

  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.error('[错误] 无法连接到 MySQL，请确认 MySQL 服务已启动');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`[错误] 访问被拒绝，请检查 .env 中的用户名和密码`);
      console.error(`  当前用户: ${DB_USER}, 密码: ${DB_PASSWORD || '(空)'}`);
    } else {
      console.error(`[错误] ${err.message}`);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('[信息] 数据库连接已关闭');
    }
  }
}

importDatabase();
