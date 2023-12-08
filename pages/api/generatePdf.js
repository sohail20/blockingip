import { jsPDF } from 'jspdf';
const puppeteer = require('puppeteer');

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

// const generatePdfFromUrl = async () => {
//     try {
//         console.log("initializing")
//         const browser = await puppeteer.launch();
//         console.log("browser", browser)
//         const page = await browser.newPage();
//         const url = 'https://example.com'; // Replace with your desired URL

//         await page.goto(url, { waitUntil: 'networkidle0' });

//         // Set the path and options for PDF generation
//         const pdfPath = 'website.pdf';
//         const pdfOptions = {
//             path: pdfPath,
//             format: 'A4',
//         };

//         // Generate PDF from the website content
//         await page.pdf(pdfOptions);

//         await browser.close();
//         console.log(`PDF generated: ${pdfPath}`);
//     } catch (error) {
//         console.error('Error generating PDF from URL:', error);
//     }
// };

// generatePdfFromUrl();