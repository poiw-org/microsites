const karavaki = require('../_lib/karavaki')
import xml from "xml"
import log from "../_lib/logs"


module.exports = async ({
    query
}, res) => {
    if (!query.ticket || !query.service) res.status(400).send("This endpoint is not intended to be used by humans. *Passive-aggressive voice*")
    //console.log(query)
    let {
        ticket,
        service
    } = query
    karavaki()
        .then(async db => {
            let authenticationRequest = await db.collection('tickets').findOne({
                ticket,
                service
            })
            let user = await db.collection('users').findOne({
                email: authenticationRequest.email
            })

            if (!user) res.status(400).send()

            await log({
                email: user.email,
                type: 'cas-login',
                service
            })

            res.send(xml({
                "cas:serviceResponse": [
                    {
                        "cas:authenticationSuccess": [{
                                "cas:user": user.username
                            },
                            {"cas:attributes":[
                                {
                                    "cas:email": user.email
                                },
                                {
                                    "cas:name": user.fullName
                                },
                                {
                                    "cas:school": user.school
                                },
                                {
                                    "cas:phone": user.phone
                                },
                            ]}
                        ]
                    }
                ]
            }))
        })
}