import db from '../../db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (userIp.includes(","))
      userIp = userIp.split(",")[0]
    db.all('SELECT * FROM blocked_ips WHERE ip_address = ?', [userIp], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Error checking IP address' });
      } else {
        console.log("rowsadsasdsadasasdasdasdasdss", rows)
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