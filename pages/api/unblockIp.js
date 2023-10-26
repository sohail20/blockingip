import db from '../../db';

async function getBlockedUserIDs(unblockThreshold) {
  return new Promise((resolve, reject) => {
    const cutoffTime = new Date(Date.now() - unblockThreshold).toISOString();
    db.all('SELECT user_id FROM blocked_ips WHERE blocked_at < ?', [cutoffTime], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const userIDs = rows.map(row => row.user_id);
        resolve(userIDs);
      }
    });
  });
}

async function deleteBlockedIPs(userIDs) {
  return new Promise((resolve, reject) => {
    // Create an array of question marks for the number of userIDs.
    const placeholders = userIDs.map(() => '?').join(', ');

    // Construct the SQL query dynamically.
    const query = `DELETE FROM blocked_ips WHERE user_id IN (${placeholders})`;

    db.run(query, userIDs, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


async function deleteLoginAttempts(userIDs) {
  // Your deleteLoginAttempts function remains the same as in the previous response.
  return new Promise((resolve, reject) => {
    // Create an array of question marks for the number of userIDs.
    const placeholders = userIDs.map(() => '?').join(', ');

    // Construct the SQL query dynamically.
    const query = `DELETE FROM login_attempts WHERE user_id IN (${placeholders})`;

    db.run(query, userIDs, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const unblockThreshold = 1 * 60 * 1000; // 1 minute in milliseconds

      const userIDsToUnblock = await getBlockedUserIDs(unblockThreshold);
      console.log("userIDsToUnblock", userIDsToUnblock)
      await deleteBlockedIPs(userIDsToUnblock);
      await deleteLoginAttempts(userIDsToUnblock);

      res.status(200).json({
        message: 'Blocked IPs and login attempts unblocked successfully',
      });
    } catch (error) {
      console.log("errorasdasdasdasdasdasd", error)
      res.status(500).json({ error: 'Error unblocking IPs and login attempts' });
    }
  }
}
