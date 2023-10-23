const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./ipblocker.db');

db.run(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      user_id TEXT,
      count INT,
      PRIMARY KEY (user_id)
    )
`);


db.run(`
CREATE TABLE IF NOT EXISTS blocked_ips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT,
  blocked_at TIMESTAMP
);
`);

module.exports = db;
