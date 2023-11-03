import db from '../../db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let { clientIp } = req.body
    console.log("clientIpeeeee", clientIp)
    db.all('SELECT * FROM blocked_ips WHERE ip_address = ?', [clientIp], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Error checking IP address' });
      } else {
        console.log("rows", rows)
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
