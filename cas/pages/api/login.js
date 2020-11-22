const karavaki = require('./_lib/karavaki')
const sha256 = require('crypto-js/sha256')
var chance = require('chance')
chance = new chance()
import hcaptcha from './_lib/recaptcha'
import {send} from "./_lib/email"
import log from "./_lib/logs"



module.exports = (req, res) => {
    if (req.method != 'POST') res.redirect(`../../login${req.query.service != null ? '?service='+escape(req.query.service) : ""}`)
    karavaki()
        .then(async db => {
            let {
                email,
                password,
                service,
                captcha,
                twofactor
            } = req.body

            if (!email || !service) {
                res.status(400).json({
                    message: "Insufficient amount of data given."
                })
            }
            if (twofactor) {

                password = sha256(password).toString()

                let user = await db.collection("users").findOne({ email, password })
                let unfinished_ticket = await db.collection("tickets").findOne({ email, twofactor})

                if (unfinished_ticket){
                    let ticket = 
                    `ST-${chance.string({
                        length: 7,
                        numeric: true
                    })}-${chance.string({
                        length: 20,
                        alpha: true,
                        numeric: true
                    })}`

                    await db.collection("users").updateOne(
                        {email: user.email},
                        {$set: {
                                passwordResetToken: ""
                            }
                        }, 
                    )


                    await db.collection("tickets").updateOne(
                        {_id: unfinished_ticket._id},
                        {
                            $set: {
                                ticket,
                            },
                            $unset:{
                                twofactor: ""
                            }
                        }, 
                    )


                    await send({
                        text: `Νέα είσοδος από IP ${req.headers['x-forwarded-for']} στην υπηρεσία ${service}. Αν δεν ήσουν εσύ, άλλαξε κωδικό άμεσα και ενημέρωσε την ομάδα!`,
                        email,
                        subject: "Νέα είσοδος μέσω του po/iw CAS"
                    })

                    await log({
                        email,
                        type: 'successful-login-with-password',
                        service
                    })

                    res.json({
                        ticket: ticket
                    })
                } else {
                    await db.collection("tickets").deleteMany({
                        email
                    })

                    await log({
                        email,
                        type: 'failed-login-2factor-invalid'
                    })

                    res.status(400).json({
                        message: 'Email, password or 2Factor code incorrect.'
                    })
                }
            } 
            if(password){
                password = sha256(password).toString()
                let user = await db.collection("users").findOne({ email, password })

                if(user){
                    let twofactor = chance.string({
                        length: 5,
                        numeric: true
                    })

                    await db.collection("tickets").deleteMany({
                        email
                    })

                    await db.collection("tickets").insertOne({
                        createdAt: new Date(),
                        email,
                        twofactor,
                        service
                    })

                    await send({
                        text: `Ο κωδικός επαλήθευσης για την είσοδό σου μέσω του po/iw CAS είναι: ${twofactor}`,
                        email,
                        subject: "Κωδικός επαλήθευσης"
                    })

                    await log({
                        email,
                        type: 'login-with-password-2factor-requested',
                        service
                    })

                    res.json({
                        requiresTwoFactor: true
                    })
                }else{
                    res.status(400).send('Wrong password.')
                }
            }
            else {

                res.status(400).json({
                    message: 'No authentication method available.'
                })
            }
        })
        .catch(e => {
            console.log(e)
            res.status(500)
        })
}
