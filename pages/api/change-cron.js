export default async function handler(req, res) {
    console.log("req", req)
    if (req.method === 'POST') {
        let { timing } = req.body
        console.log("timing", timing)
    }
}