const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'df876790406',
  database: 'college_info_system',
  charset: 'utf8mb4'
});

module.exports = connection;