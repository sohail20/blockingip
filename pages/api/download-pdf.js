export default async function handler(req, res) {
    try {
        if (req.method === "POST") {

            const pdfcrowd = require("pdfcrowd");

            // create the API client instance
            const client = new pdfcrowd.HtmlToPdfClient(
                "sohailbhatti",
                "72b4a03bec61376c3d6dd9d52bf41aff"
            );

            // run the conversion and send the result as a response
            client.convertUrlToFile(
                "https://the.akdn/en/resources-media/whats-new/news-release/prince-rahim-aga-khan-joins-world-leaders-at-cop28",
                "example.pdf",
                function (err, fileName) {
                    if (err) {
                        console.error("Pdfcrowd Error: " + err);
                        return res.status(500).send("Error generating PDF");
                    }

                    console.log("Success: the file was created " + fileName);
                    // Send the generated PDF as a response
                    res.status(200).sendFile(fileName);
                }
            );
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).send("Internal Server Error");
    }
}
