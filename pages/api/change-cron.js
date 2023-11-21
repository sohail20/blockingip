import { changeCronTiming } from "../../db"

export default async function handler(req, res) {
    console.log("req", req)
    if (req.method === 'POST') {
        let { time } = req.body.entity.attributes
        console.log("time", time)
        changeCronTiming(`*/${time} * * * *`)
        res.status(200).send({ message: "success" })
    }
}