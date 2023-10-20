import db from '../../db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const unblockThreshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const { ip_address } = req.body;

    db.run('DELETE FROM blocked_ips WHERE blocked_at < ?', [new Date(Date.now() - unblockThreshold).toISOString()], (err) => {
      if (err) {
        res.status(500).json({ error: 'Error unblocking IPs' });
      } else {
        res.status(200).json({ message: 'IPs unblocked successfully' });
      }
    });

    if (ip_address) {
      db.run('DELETE FROM blocked_ips WHERE ip_address = ?', [ip_address], (err) => {
        if (err) {
          res.status(500).json({ error: 'Error unblocking IP address' });
        } else {
          res.status(200).json({ message: 'IP unblocked successfully' });
        }
      });
    } else {
      res.status(400).json({ error: 'Invalid request' });
    }
  }
}
