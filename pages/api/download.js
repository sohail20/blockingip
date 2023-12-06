import puppeteer from "puppeteer";
import fs from "fs"
// import { loggerFunction } from "../../lib/logger";

async function createPdf(pageUrl) {
    try {

        console.log("asdasdsadasd")
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        await page.authenticate({ 'username': 'dev-akdn', 'password': 'AKDN@#$%' });
        // Navigate to the URL
        await page.goto('https://dev.the.akdn/en/resources-media/whats-new/news-release/un-deputy-secretary-general-calls-global-action-address-inequality-2019-pluralism?loadimages=true', {
            waitUntil: 'networkidle0', // Wait for network to be idle
        });

        // Generate PDF
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();

        // // Save PDF to file
        // fs.writeFileSync('output.pdf', pdf);
        console.log('PDF generated successfully!');
        return pdf
    } catch (error) {
        console.log("error", error)
        // loggerFunction("createPdf", error)
    }
    return false
}

export default async function downloadPdf(req, res) {
    if (req.method === 'POST') {
        // let body = req.body;
        // try {
        //     body = JSON.parse(body);
        // } catch (error) {
        //     body = body;
        // }

        // let pageUrl = (body && body.url) ? body.url : "";

        // const pdf = await createPdf(pageUrl);
        // if (pdf) {
        //     res.setHeader('Content-disposition', 'inline; filename="download.pdf"');
        //     res.setHeader('Content-Type', 'application/pdf');
        //     res.end(pdf);
        // } else {
        //     res.status(500).send({ error: 'Failed to generate PDF' });
        // }
        console.log("initializing")
        const browser = await puppeteer.launch();
        console.log("browser", browser)
        const page = await browser.newPage();
        const url = 'https://dev.the.akdn/en/resources-media/whats-new/news-release/un-deputy-secretary-general-calls-global-action-address-inequality-2019-pluralism?loadimages=true'; // Replace with your desired URL

        await page.goto(url, { waitUntil: 'networkidle0' });

        // Set the path and options for PDF generation
        const pdfOptions = {
            format: 'A4',
        };

        // Generate PDF from the website content
        const pdf = await page.pdf(pdfOptions);

        await browser.close();
        res.setHeader('Content-disposition', 'inline; filename="download.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        res.end(pdf);
    } else {
        res.status(405).send({ error: 'Method not allowed' });
    }
}
