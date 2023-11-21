const sqlite3 = require('sqlite3').verbose();
const cron = require('node-cron');
const db = new sqlite3.Database('./ipblocker.db');

let scheduledTask = null;

// Function to start a cron job
function startCronJob(schedule) {
  if (scheduledTask) {
    // Stop the previously scheduled task
    scheduledTask.stop();
  }

  console.log("schedule", schedule)
  scheduledTask = cron.schedule(schedule, async () => {
    try {

      const response = await fetch('http://localhost:3000/api/unblockIp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("response.ok", response.ok)
      if (response.ok) {
        const data = await response.json();
      } else {
        console.error('API request failed');
      }
    } catch (error) {
    }
    // Your task logic here
  });

  console.log(`Cron job scheduled for ${schedule}`);
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

// cron.schedule('*/30 * * * * *', async () => {
//   try {

//     const response = await fetch('http://localhost:3000/api/unblockIp', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.ok) {
//       const data = await response.json();
//     } else {
//       console.error('API request failed');
//     }
//   } catch (error) {
//   }
// });

startCronJob("*/10 * * * * *");

// Function to dynamically change cron job timing
function changeCronTiming(newSchedule) {
  startCronJob(newSchedule);
}

exports.db = db;
exports.changeCronTiming = changeCronTiming