import {send} from "./_lib/email"
const karavaki = require('./_lib/karavaki')
var chance = require('chance')
chance = new chance()
import {validate} from './_lib/recaptcha'


module.exports = async ({body,query,method},res) => {
    return new Promise(async (resolve,reject)=>{
        const db = await karavaki()

        if (body.email){   
            await validate(body.recaptcha)
            .catch(e=>{
                res.status(400).send('Recaptcha calidation failed')
                resolve()
            })
            if(body.email.length != 7){
                res.status(400).send('Ο Αριθμός Μητρώου πρέπει να έχει την μορφή thXXXX')
                resolve()
            }else if(body.email.substring(0,2) != 'th'){
                res.status(400).send('Ο Αριθμός Μητρώου πρέπει να έχει την μορφή thXXXX')
                resolve()
            }
            else if(parseInt(body.email.substring(2,7)) < 20080){
                res.status(400).send('Φαίνεται ότι δεν είσαι νεοεισακτέος φοιτητής στο τμήμα.')
                resolve()
            }else{
                let email = body.email + '@edu.hmu.gr'

                let alreadyRegistered = await db.collection('parousiasi-tmimatos').findOne({
                    email
                })

                if(alreadyRegistered) {
                    if(alreadyRegistered.verified === true){
                        res.status(400).send('Μη σπαμάρεις :\'/. Έχεις ήδη γραφτεί.')
                        resolve()
                    }else if(alreadyRegistered.verified === false){
                        res.status(400).send('Έχεις ήδη υποβάλει αίτημα εγγραφής. Έλεγξε το email σου για το link επιβεβαίωσης. Αν αντιμετωπίζεις πρόβλημα, στείλε μας email στο poiw-team@protonmail.com.')
                        resolve()
                    }
                }else{
                    let token = chance.string({
                        length: 256,
                        alpha: true,
                        numeric: true
                    })
    
                    await db.collection('parousiasi-tmimatos').insertOne({
                        email,
                        token,
                        verified: false
                    })
    
                    let link = `${process.env.NODE_ENV == "development" ? "http://localhost:3001/api/register?t=" : "https://intro.events.poiw.org/api/register?t="}${token}`
    
                    await send({ 
                        email: email,
                        text: `Χαιρόμαστε που ενδιαφέρεσαι για την παρουσίασή μας! Μπές σε αυτόν τον σύνδεσμο για να επιβεβαιώσεις την εγγραφή σου στην εκδήλωση: ${link}. Αν έχεις κάποια απορία, μπορείς να μας στείλεις στο poiw-team@protonmail.com.`,
                        html: `Χαιρόμαστε που ενδιαφέρεσαι για την παρουσίασή μας! Μπές σε αυτόν τον σύνδεσμο για να επιβεβαιώσεις την εγγραφή σου στην εκδήλωση: <a href="${link}">${link}</a>. Αν έχεις κάποια απορία, μπορείς να μας στείλεις στο poiw-team@protonmail.com.`,
                        subject: " Εγγραφή σε event του po/iw",
                    })
    
                    res.send("OK") 
                }
            }
        }
        if (query.t){
            let user = await db.collection("parousiasi-tmimatos").findOne({token: query.t})
            
            if(!user){
                res.status(400).send('This link does not correspond to any pending registration. It has probably already been used. Honestly, we don\'t know. ~po/iw team')
            }

            await db.collection("parousiasi-tmimatos").updateOne(
                {email: user.email},
                {$set: {
                        verified: true,
                        token: ''
                    }
                }, 
            )

            res.redirect('../../?verified=true')

        }else{
            res.status(400).send('Δεν έχουν δοθεί επαρκή δεδομένα για να επεξεργαστεί το αίτημά σου.')
        }
    })
}
