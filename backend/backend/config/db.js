require('dotenv').config();
const mysql = require('mysql2/promise');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

process.env.LANG = 'zh_CN.UTF-8';
process.env.LC_ALL = 'zh_CN.UTF-8';

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error(`\x1b[31m[错误] 缺少必要的环境变量: ${missingVars.join(', ')}\x1b[0m`);
  console.error('\x1b[33m[提示] 请创建 .env 文件并配置数据库连接信息，参考 .env.example 文件\x1b[0m');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production' && process.env.DB_PASSWORD === 'your_database_password_here') {
  console.error('\x1b[31m[错误] 生产环境中使用了默认密码！请修改 .env 文件中的 DB_PASSWORD\x1b[0m');
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: process.env.DB_CHARSET || 'utf8mb4',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  multipleStatements: true,
  namedPlaceholders: false,
  connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT) || 10000,
  acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT) || 10000,
  timeout: parseInt(process.env.DB_TIMEOUT) || 60000
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    console.log('\x1b[32m[成功] 数据库连接测试通过\x1b[0m');
  } catch (err) {
    console.error(`\x1b[31m[错误] 数据库连接失败: ${err.message}\x1b[0m`);
    process.exit(1);
  }
};

const query = async (sql, params) => {
  const connection = await pool.getConnection();
  try {
    await connection.execute("SET NAMES 'utf8mb4'");
    await connection.execute("SET CHARACTER SET 'utf8mb4'");
    await connection.execute("SET collation_connection = 'utf8mb4_unicode_ci'");
    
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
};

module.exports = { pool, query, testConnection };
module.exports.default = pool;