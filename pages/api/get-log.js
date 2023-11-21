import fs from 'fs';
import path from 'path';

function isValidDateFormat(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { date } = req.query;
        if (!date || !isValidDateFormat(date)) {
            return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD.' });
        }
        const rootPath = process.cwd();

        const logFileName = `log-${date}.log`;
        const logFilePath = path.join(rootPath, logFileName);

        try {
            // Read log file
            const logData = fs.readFileSync(logFilePath, 'utf-8');
        
            // Parse and filter logs for the specified date
            const logs = logData
              .split('\n')
              .map((line) => {
                try {
                  return JSON.parse(line);
                } catch (error) {
                  console.error('Error parsing log entry:', error);
                  return null; // Skip malformed log entries
                }
              })
              //.filter((log) => log && log.timestamp.split('T')[0] === date); // Assuming timestamp key exists in logs
        
            return res.status(200).json(logs);
          } catch (error) {
            console.error('Error retrieving logs:', error);
            return res.status(500).json({ error: 'Server error' });
          }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
