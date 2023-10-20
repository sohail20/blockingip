import db from '../../db';

const blockedAt = new Date().toISOString();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ip_address } = req.body;
    if (ip_address) {
      db.run('INSERT INTO blocked_ips (ip_address, blocked_at) VALUES (?, ?)', [ip_address, blockedAt], (err) => {
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
