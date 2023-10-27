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
      user_id TEXT,
      count INT,
      PRIMARY KEY (user_id)
    )
`);


db.run(`
CREATE TABLE IF NOT EXISTS blocked_ips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT,
  user_id TEXT,
  blocked_at TIMESTAMP
);
`);

cron.schedule('*/30 * * * *', async () => {
  if (isCronJobRunning()) {
    return;
  }

  createLockFile();

  try {
    // if (user !== null || user !== "") {
      const response = await fetch('http://localhost:3000/api/unblockIp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API request successful:', data);
      } else {
        console.error('API request failed');
      }
    // }
  } catch (error) {
    // console.error('An error occurred while fetching the API:', error);
  } finally {
    // console.log('Cron job finished');
    removeLockFile();
  }
});

module.exports = db;
