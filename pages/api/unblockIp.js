import { db } from '../../db';

async function getBlockedUserIDs(unblockThreshold) {
  return new Promise((resolve, reject) => {
    const cutoffTime = new Date(Date.now() - unblockThreshold).toISOString();
    db.all('SELECT ip_address FROM blocked_ips WHERE blocked_at < ?', [cutoffTime], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const userIDs = rows.map(row => row.ip_address);
        resolve(userIDs);
      }
    });
  });
}

async function deleteBlockedIPs(userIDs) {
  return new Promise((resolve, reject) => {
    const placeholders = userIDs.map(() => '?').join(', ');
    const query = `DELETE FROM blocked_ips WHERE ip_address IN (${placeholders})`;

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
  return new Promise((resolve, reject) => {
    const placeholders = userIDs.map(() => '?').join(', ');

    const query = `DELETE FROM login_attempts WHERE ip_address IN (${placeholders})`;

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
      const unblockThreshold = 1 * 60 * 1000; // 30 minute in milliseconds

      const userIDsToUnblock = await getBlockedUserIDs(unblockThreshold);
      await deleteBlockedIPs(userIDsToUnblock);
      await deleteLoginAttempts(userIDsToUnblock);

      res.status(200).json({
        message: 'Blocked IPs and login attempts unblocked successfully',
      });
    } catch (error) {
      res.status(500).json({ error: 'Error unblocking IPs and login attempts' });
    }
  }
}
