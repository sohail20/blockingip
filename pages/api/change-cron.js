import { changeCronTiming } from "./cron"

export default async function handler(req, res) {
    console.log("req", req)
    if (req.method === 'POST') {
        let { time } = req.body.entity.attributes
        await changeCronTiming(`*/${time} * * * *`)
        res.status(200).send({ message: "success" })
    }
}