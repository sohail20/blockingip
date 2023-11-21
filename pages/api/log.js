const { existsSync, mkdirSync } = require('fs');
const { join } = require('path');
import { createLogger, transports, format } from 'winston';
require('winston-daily-rotate-file');

const rootPath = process.cwd() + `/logs`;
console.log("rootPath", rootPath)
const errorLog = join(rootPath, 'error-%DATE%.log');
const requestLog = join(rootPath, 'request-%DATE%.log');

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
    return (offset >= 0 ? "+" : "-") + parseInt(offset / 60) + ":" + offset % 60
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
        new transports.DailyRotateFile({
            filename: errorLog,
            zippedArchive: true,
            maxSize: '100m',
            level: 'error'
        }),
        new transports.DailyRotateFile({
            filename: requestLog,
            // datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '100m',
            // format: format.combine(isRequest())
        }),
    ],
});
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const config = req.body

        if (config.level === "info")
            logger.info({
                requestBody: {
                    method: config.method.toUpperCase(),
                    url: config.url,
                    request_body: JSON.stringify(config.data),
                }
            });
        else if (config.level === "error")
            logger.error('Received POST request:qweqweqwe');

    }
}