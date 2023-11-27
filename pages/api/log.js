import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const rootPath = process.cwd() + `/logs`;
const errorLog = join(rootPath, 'error-%DATE%.log');
const requestLog = join(rootPath, 'request-%DATE%.log');

console.log("rootPath", rootPath)

// Create the log directory if it does not exist
if (!existsSync(rootPath)) {
    mkdirSync(rootPath);
}

const isRequest = format((info, opts) => {
    if (info.isRequest) {
        return info;
    }
    return false;
});

function timezoneCalculate() {
    let x = new Date();
    let offset = -x.getTimezoneOffset();
    return (offset >= 0 ? "+" : "-") + parseInt(offset / 60) + ":" + offset % 60;
}

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: `YYYY-MM-DD HH:mm:ss ${timezoneCalculate()}`
        }),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new DailyRotateFile({
            filename: errorLog,
            zippedArchive: true,
            maxSize: '100m',
            level: 'error',
            maxFiles: '30d'
        }),
        new DailyRotateFile({
            filename: requestLog,
            zippedArchive: true,
            maxSize: '100m',
            maxFiles: '30d'
        }),
    ],
});

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { level, method, url, data } = req.body;
        console.log("level", level)
        if (level === "info") {
            logger.info(JSON.stringify({
                requestBody: {
                    method: method.toUpperCase(),
                    url,
                    request_body: JSON.stringify(data),
                }
            }));
            res.status(200).send({ message: "success" })
        } else if (level === "error") {
            logger.error('Received POST request');
            res.status(200).send({ message: "failed" })
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
