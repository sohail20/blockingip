export default async function handler(req, res) {
    if (req.method === 'POST') {
        let { timing } = req.body
        console.log("timing", timing)
    }
}