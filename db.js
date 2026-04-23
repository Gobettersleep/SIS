const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'df876790406',
  database: 'college_info_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 导出连接池
module.exports = pool;