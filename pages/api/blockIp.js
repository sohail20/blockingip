import db from '../../db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ip_address, user_id } = req.body;
    if (ip_address) {
      const blockedAt = new Date().toISOString();

      db.run('INSERT INTO blocked_ips (ip_address,user_id, blocked_at) VALUES (?, ?)', [ip_address, user_id, blockedAt], (err) => {
        if (err) {
          res.status(500).json({ error: 'Error blocking IP address' });
        } else {
          res.status(200).json({ message: 'IP blocked successfully' });
        }
      });
    } else {
      res.status(400).json({ error: 'Invalid request' });
    }
  }
}