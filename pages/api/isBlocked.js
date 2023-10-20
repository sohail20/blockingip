import db from '../../db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("userIp",userIp)
    db.all('SELECT * FROM blocked_ips WHERE ip_address = ?', [userIp], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Error checking IP address' });
      } else {
        if (rows.length > 0) {
          res.status(200).json({ blocked: true });
        } else {
          res.status(200).json({ blocked: false });
        }
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
