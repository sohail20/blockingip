import axios from 'axios';
import https from "https"

function getCurrentDateTime() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Adding 1 as months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');
    const hour = String(today.getHours()).padStart(2, '0');
    const minute = String(today.getMinutes()).padStart(2, '0');
    const second = String(today.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

async function deleteOldRecords(coreName, duration) {
    const currentDate = new Date();
    const fromDate = new Date(currentDate.getTime() - duration * 24 * 60 * 60 * 1000); // Calculate the date from the duration in milliseconds
    const formattedFromDate = fromDate.toISOString().split('T')[0]; // Format fromDate to 'YYYY-MM-DD' format

    const deleteQuery = `https://52.200.105.33:8983/solr/${coreName}/update?commit=true`;
    const deleteData = {
        "delete": {
            "query": `dateField:[* TO ${formattedFromDate}T00:00:00Z]`
        }
    };

    try {
        const response = await axios.post(deleteQuery, deleteData, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
        console.log(`Deleted records older than ${formattedFromDate}. Solr response:`, response.data);
    } catch (error) {
        console.error('Error deleting records:', error);
    }
}

async function deleteRecordsByDate(coreName, dateToDelete) {
    const deleteQuery = `https://52.200.105.33:8983/solr/${coreName}/update?commit=true`;
    const deleteData = {
        delete: {
            query: `date:"${dateToDelete}T00:00:00Z"`, // Use the specific date to delete records
        },
    };

    try {
        const response = await axios.post(deleteQuery, deleteData, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
        console.log(`Deleted records with date ${dateToDelete}. Solr response:`, response.data);
    } catch (error) {
        console.error('Error deleting records:', error);
    }
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { level, method, url, data } = req.body;
        const currentDateTime = getCurrentDateTime();
        const dayDate = currentDateTime.split(" ")
        if (level === "info") {
            const logData = {
                level,
                method: method.toUpperCase(),
                dateCreated: currentDateTime,
                date: dayDate[0],
                url,
                request_body: JSON.stringify(data),
            };

            // Send log data to Solr
            axios.post('https://52.200.105.33:8983/solr/logs/update/json/docs', logData, {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            })
                .then(response => {
                    if (response.data) {
                        axios.get(`https://52.200.105.33:8983/solr/logs/update?commit=true`, {
                            httpsAgent: new https.Agent({
                                rejectUnauthorized: false
                            })
                        });
                        res.status(200).send({ message: "success" });
                    }
                })
                .catch(error => {
                    console.error('Error sending log data to Solr:', error);
                    res.status(500).send({ message: "failed" });
                });
        } else if (level === "error") {
            // Handle error log here if needed
            res.status(200).send({ message: "failed" });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
