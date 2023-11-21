export default async function handler(req, res) {
    console.log("req", req)
    if (req.method === 'POST') {
        let { timing } = req.body.entity.attributes
        console.log("timing", timing)
        res.status(200).send({ message: "success" })
    }
}