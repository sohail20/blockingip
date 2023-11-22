import fs from 'fs';
import path from 'path';

function isValidDateFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date, type } = req.query;
  if (!type) {
    return res.status(400).json({ error: 'Invalid type format. Please use type=error or type=request' });
  }
  if (!date || !isValidDateFormat(date)) {
    return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD.' });
  }

  const rootPath = process.cwd();
  const logFileName = `${type}-${date}.log`;
  const logFilePath = path.join(rootPath + "\\logs", logFileName);

  try {
    // Read log file
    const logData = fs.readFileSync(logFilePath, 'utf-8');
    let logs = []
    // Parse and filter logs for the specified date
    if (logData)
      logs = logData
        .split('\n')
        .map((line) => {
          try {
            const boody = line.split("info: ")[1]
            if (typeof boody !== "undefined")
              return JSON.parse(boody);
          } catch (error) {
            console.error('Error parsing log entry:', error);
            return null; // Skip malformed log entries
          }
        })
    //.filter((log) => log && log.timestamp.split('T')[0] === date); // Assuming timestamp key exists in logs
    console.log("logs", logs)
    console.log("logs.pop()", logs.pop())
    if (logs.length > 0)
      return res.status(200).json(logs);
    else return res.status(200).json({ message: "No logs found" });
  } catch (error) {
    console.log("error", error)
    if (error.message.includes("no such file or directory"))
      return res.status(404).json({ error: 'No logs found' });
    else return res.status(404).json({ "error": "Server error" });
  }
}
