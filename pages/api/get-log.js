import axios from 'axios';
import https from "https"

const agent = new https.Agent({
  rejectUnauthorized: false
});

function isValidDateFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date, level, row } = req.query;
  // console.log("{ date, level, row }", req.method, { date, level, row })
  if (!level) {
    return res.status(400).json({ error: 'Invalid type format. Please use level=info or level=request' });
  }
  if (!date || !isValidDateFormat(date)) {
    return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD.' });
  }

  try {
    const solrResponse = await axios.get('https://52.200.105.33:8983/solr/logs/select', {
      params: {
        q: `level:${level} AND date:"${date}T00:00:00Z"`, // Query based on level and date
        rows: row || 10, // Adjust as per your requirement
        wt: 'json',
      },
      httpsAgent: agent // Pass the agent here
    });

    console.log("solrResponse", solrResponse)
    const solrData = solrResponse.data.response.docs; // The retrieved Solr data

    if (solrData.length > 0)
      res.status(200).json(solrData);
    else
      res.status(200).json({ message: "No logs found" });

  } catch (error) {
    console.log("error", error)
  }
}
