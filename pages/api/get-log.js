import axios from 'axios';

function isValidDateFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date, level } = req.query;
  if (!level) {
    return res.status(400).json({ error: 'Invalid type format. Please use level=info or type=request' });
  }
  if (!date || !isValidDateFormat(date)) {
    return res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD.' });
  }

  try {
    const solrResponse = await axios.get('http://52.207.232.135:4141/solr/log/select', {
      params: {
          q: `level:${level} AND dateCreated:"${date}*"`, // Query based on level and date
          rows: 10, // Adjust as per your requirement
          wt: 'json',
      },
  });

  const solrData = solrResponse.data.response.docs; // The retrieved Solr data

  res.status(200).json(solrData);
  } catch (error) {
    console.log("error", error)
  }
}
