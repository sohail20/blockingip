import { jsPDF } from 'jspdf';

export default async function handler(req, res) {
  try {
    // Create a new PDF document
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text('Hello, this is a PDF!', 10, 10);

    // Generate the PDF as a data URI
    const pdfDataUri = doc.output('datauristring');

    // Set the response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');

    // Send the PDF data URI as response
    res.status(200).end(pdfDataUri);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).end('Error generating PDF');
  }
}
