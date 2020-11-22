import karavaki from "./_lib/karavaki"
import {send} from "./_lib/email"
const sha256 = require('crypto-js/sha256')
var chance = require('chance')
chance = new chance()
import hcaptcha from './_lib/recaptcha'
import passwordValidator from "./_lib/passwordValidator"
import log from "./_lib/logs"


const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = (req,res) => {
    karavaki()
        .then(async db=>{
            let {email, username, fullName, school, phone, password, captcha} = req.body
            username = username.toLowerCase()
            email = email.toLowerCase()

            await hcaptcha
                .validate(captcha)
                .catch(e=>res.status(400).send('Recaptcha verification failed'))

            if(!email || !fullName || !school || !password || !phone) res.status(400).send('Missing required information.')

            await passwordValidator(password)
                .catch(e=>{
                    res.status(400).send(e)
                    return
                })
            
            if(!validateEmail(email)) res.status(400).send('Incorrect email format.')

            let emailExists = await db.collection('users').findOne({email})
            let usernameExists = await db.collection("users").findOne({username})

            let blocked_usernames = await db.collection("config").findOne({name: 'blocked_usernames'}) 


            if(emailExists) {
                await log({
                    email,
                    type: 'failed-registration-email-exists'
                })

                res.status(400).send('Υπάρχει ήδη χρήστης με αυτό το email.')
                return
            }
        
            if(usernameExists){
                await log({
                    email,
                    type: 'failed-registration-username-exists',
                    username
                })

                res.status(400).send('Υπάρχει ήδη χρήστης με αυτό το username.')
                return
            }

            if(blocked_usernames.value.includes(username)) {
                await log({
                    email,
                    type: 'failed-registration-username-blocked',
                    username
                })

                res.status(400).send('Η χρήση αυτού του username έχει απαγορευτεί.')
                return
            }

            password = sha256(password).toString()

            let registrationToken = chance.string({ length: 128,  alpha: true, numeric: true })
            
            await db.collection("pendingRegistrations").insertOne({
                email,
                password,
                school,
                fullName,
                phone,
                username,
                registrationToken
            })

            let activationLink = `${process.env.NODE_ENV == "development" ? "http://localhost:3000/api/activateAccount?t=" : "https://auth.poiw.org/api/activateAccount?t="}${registrationToken}`
            await send({
                email,
                fullName,
                subject: "Ενεργοποίηση λογαριασμού po/iw",
                text: `Καλωσήρθες στο po/iw! Για να ενεργοποιήσεις το account σου, πάτα αυτό το λίνκ: ${activationLink}.`,
                html: `Καλωσήρθες στο po/iw! Για να ενεργοποιήσεις το account σου, πάτα εδώ: <b><a href="${activationLink}">${activationLink}</a>.`
            })

            await log({
                email,
                type: 'successful-registration-activation-pending'
            })

            res.send('OK')
        })
}