import {send} from "./_lib/email"
const karavaki = require('./_lib/karavaki')
var chance = require('chance')
chance = new chance()
const sha256 = require('crypto-js/sha256')
import captcha from './_lib/recaptcha'
import log from "./_lib/logs"



module.exports = async ({body,query,method},res) => {
    const db = await karavaki()

    if (body.email){   

        await captcha
            .validate(body.captcha)
            .catch(e=>res.status(400).send('Recaptcha verification failed'))

        let user = await db.collection("users").findOne({email: body.email})

        if (!user) res.status(400).send("This user doesn\'t exist.")

        let passwordResetToken = chance.string({
            length: 1024,
            alpha: true,
            numeric: true
        })

        let passwordResetLink = `${process.env.NODE_ENV == "development" ? "http://localhost:3000/resetPassword?t=" : "https://auth.poiw.org/resetPassword?t="}${passwordResetToken}`

        await db.collection("users").updateOne(
            {email: user.email},
            {$set: {passwordResetToken}}, 
        )

        await send({
            email: user.email,
            text: `Αν δεν ζήτησες επαναφορά κωδικού στο po/iw, τότε αγνόησε αυτό το μήνυμα. Για επαναφορά, μπες εδώ: ${passwordResetLink}`,
            html: `Αν δεν ζήτησες επαναφορά κωδικού στο po/iw, τότε αγνόησε αυτό το μήνυμα. Για επαναφορά, πάτα  εδώ: <a href="${passwordResetLink}">${passwordResetLink}</a>`,
            subject: "Επαναφορά κωδικού στο po/iw",
            fullName: user.fullName
        })

        await log({
            email: user.email,
            type: 'password-reset-requested'
        })

        res.send("OK")
    }
    if (body.token && body.password){
        let user = await db.collection("users").findOne({passwordResetToken: body.token})
        let password = sha256(body.password).toString()
        if (!user) res.status(400).send("This user doesn\'t exist.")

        await db.collection("users").updateOne(
            {email: user.email},
            {$set: {
                    password,
                    passwordResetToken: ""
                }
            }, 
        )

        await log({
            email: user.email,
            type: 'password-reset-successful'
        })

        res.send("OK")

    }
}