const sqlite3 = require('sqlite3').verbose();
const cron = require('node-cron');
// const fetch = require('node-fetch');
const fs = require('fs');
const lockFilePath = './lock-file.lock';
const db = new sqlite3.Database('./ipblocker.db');


function isCronJobRunning() {
  return fs.existsSync(lockFilePath);
}

function createLockFile() {
  fs.writeFileSync(lockFilePath, '');
}

function removeLockFile() {
  fs.unlinkSync(lockFilePath);
}

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

cron.schedule('*/1 * * * *', async () => {
  if (isCronJobRunning()) {
    return;
  }

  createLockFile();

  try {

    const response2 = await fetch('http://3.85.132.69:3000/api/isBlocked', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // console.log("response2", response2)

    const response = await fetch('http://localhost:3000/api/unblockIp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
    } else {
      console.error('API request failed');
    }
  } catch (error) {
  } finally {
    removeLockFile();
  }
});

module.exports = db;
