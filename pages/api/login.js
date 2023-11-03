const bcrypt = require('bcrypt');

import db from '../../db';

const saltRounds = 10; // You can adjust the number of salt rounds as needed
const plainTextPassword = "123456";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        let { clientIp } = req.body
        if (clientIp && clientIp.includes(","))
            clientIp = clientIp.split(",")[0]
        
        const { password } = req.body;

        // Generate a hashed password
        const encrypted = await bcrypt.hash(plainTextPassword, saltRounds);
        const passwordMatch = await bcrypt.compare(password, encrypted);

        if (passwordMatch) {
            res.status(200).json({ message: "Logged in successfully", status: true });
        } else {
            try {
                const response = await attemptHandler(clientIp);
                res.status(response.error ? 500 : 200).send(response);
            } catch (error) {
                console.error("Error in attemptHandler:", error);
                res.status(500).send({ message: 'Server error' });
            }
        }
    }
}

function getCountByUserId(ipAddress) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT count FROM login_attempts WHERE ip_address = "${ipAddress}"`, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row[0]);
            }
        });
    });
}

async function insertBlockedIP(ipAddress, blockedAt) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO blocked_ips (ip_address, ip_address, blocked_at) VALUES (?, ?, ?)', [ipAddress, ipAddress, blockedAt], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function updateLoginAttempts(ipAddress, newCount) {
    return new Promise((resolve, reject) => {
        db.run("UPDATE login_attempts SET count = $value WHERE ip_address = $id", {
            $value: newCount,
            $id: ipAddress,
        }, (err, data) => {
            if (err) {
                console.error('Error updating login_attempts:', err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function attemptHandler(ipAddress) {
    try {
        let countTmp = 1
        const row = await getCountByUserId(ipAddress);
        if (row && row.count > 0) {
            const newCount = parseInt(row.count + 1);
            countTmp = newCount
            if (newCount >= 3) {
                const blockedAt = new Date().toISOString();
                await insertBlockedIP(ipAddress, blockedAt);
                return { message: 'IP blocked' };
            } else {
                await updateLoginAttempts(ipAddress, newCount);
            }
        } else {
            // User does not exist, insert a new record. asdas
            try {
                db.run('INSERT INTO login_attempts (count, ip_address) VALUES (?, ?)', [1, ipAddress], (err, row) => {
                    if (err) {
                    } else {
                    }
                });
            } catch (error) {
                console.error('Error updating login attempts:', error);
            }
        }

        return { message: `${3 - countTmp} attempt left` };
    } catch (error) {
        console.error("Error in attemptHandler:", error);
        return { error: 'Server error' };
    }
}
