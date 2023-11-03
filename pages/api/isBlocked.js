import db from '../../db';

export default async function handler(req, res) {
  console.log("req.method", req.method)
  if (req.method === 'GET') {
    let userIp = req.headers['x-real-ip'] || req.connection.remoteAddress;
    console.log("userIp", userIp)
    if (userIp.includes(","))
      userIp = userIp.split(",")[0]
    db.all('SELECT * FROM blocked_ips WHERE ip_address = ?', [userIp], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Error checking IP address' });
      } else {
        if (rows.length > 0) {
          res.status(403).json({ blocked: true });
        } else {
          res.status(200).json({ blocked: false });
        }
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
