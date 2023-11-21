const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./ipblocker.db');

db.run(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      ip_address TEXT,
      count INT,
      PRIMARY KEY (ip_address)
    )
`);

db.run(`
CREATE TABLE IF NOT EXISTS blocked_ips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT,
  blocked_at TIMESTAMP
);
`);

exports.db = db;
