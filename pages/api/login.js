import db from '../../db';

const userPassword = "123456";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        let clientIp = req.headers['x-forwarded-for'];
        if (clientIp.includes(","))
            clientIp = clientIp.split(",")[0]
        const { userID, password } = req.body;
        if (password === userPassword) {
            res.status(200).json({ message: "Logged in successfully", status: true });
        } else {
            try {
                const response = await attemptHandler(userID, clientIp);
                res.status(response.error ? 500 : 200).send(response);
            } catch (error) {
                console.error("Error in attemptHandler:", error);
                res.status(500).send({ message: 'Server error' });
            }
        }
    }
}

function getCountByUserId(user_id) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT count FROM login_attempts WHERE user_id = "${user_id}"`, (err, row) => {
            if (err) {
                reject(err);
            } else {
                // If a row with the provided user_id is found, resolve with the count value; otherwise, resolve with 0.
                resolve(row[0]);
            }
        });
    });
}

async function insertBlockedIP(ipAddress, userID, blockedAt) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO blocked_ips (ip_address, user_id, blocked_at) VALUES (?, ?, ?)', [ipAddress, userID, blockedAt], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function updateLoginAttempts(user_id, newCount) {
    return new Promise((resolve, reject) => {
        db.run("UPDATE login_attempts SET count = $value WHERE user_id = $id", {
            $value: newCount,
            $id: user_id,
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

async function attemptHandler(user_id, ipAddress) {
    try {
        let countTmp = 1
        const row = await getCountByUserId(user_id);
        if (row && row.count > 0) {
            const newCount = parseInt(row.count + 1);
            countTmp = newCount
            if (newCount >= 3) {
                const blockedAt = new Date().toISOString();
                await insertBlockedIP(ipAddress, user_id, blockedAt);
                return { message: 'IP blocked' };
            } else {
                await updateLoginAttempts(user_id, newCount);
            }
        } else {
            // User does not exist, insert a new record. asdas
            try {
                db.run('INSERT INTO login_attempts (count, user_id) VALUES (?, ?)', [1, user_id], (err, row) => {
                    if (err) {
                    } else {
                    }
                });
            } catch (error) {
                console.error('Error updating login attempts:', error);
            }
        }
        // const user_id = 'user123'; // Replace with the user_id you want to get the count for.

        // try {
        //     const count = await getCountByUserId(user_id);
        //     console.log(`Count for user ${user_id}: ${count}`);
        // } catch (error) {
        //     console.error('Error getting count:', error);
        // }

        return { message: `${3 - countTmp} attempt left` };
    } catch (error) {
        console.error("Error in attemptHandler:", error);
        return { error: 'Server error' };
    }
}
