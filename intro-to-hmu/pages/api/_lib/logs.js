
import karavaki from "./karavaki"

module.exports = async (log) => {
    karavaki()
        .then(async db=>{
            db.collection("logs").insertOne({
                createdAt: new Date(),
                ...log
            })
        })
    }