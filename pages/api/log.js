import axios from 'axios';

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

    const deleteQuery = `http://52.207.232.135:4141/solr/${coreName}/update?commit=true`;
    const deleteData = {
        "delete": {
            "query": `dateField:[* TO ${formattedFromDate}T00:00:00Z]`
        }
    };

    try {
        const response = await axios.post(deleteQuery, deleteData);
        console.log(`Deleted records older than ${formattedFromDate}. Solr response:`, response.data);
    } catch (error) {
        console.error('Error deleting records:', error);
    }
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { level, method, url, data } = req.body;
        const currentDateTime = getCurrentDateTime();

        if (level === "info") {
            const logData = {
                level,
                method: method.toUpperCase(),
                dateCreated: currentDateTime,
                url,
                request_body: JSON.stringify(data),
            };

            // Send log data to Solr
            axios.post('http://52.207.232.135:4141/solr/log/update/json/docs', logData)
                .then(response => {
                    if(response.data){
                        axios.get(`http://52.207.232.135:4141/solr/log/update?commit=true`);
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
