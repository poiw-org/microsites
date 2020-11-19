const mailjet = require('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

module.exports = {
    send({
        text,
        email,
        fullName,
        subject,
        html
    }) {
        return new Promise((resolve, reject) => {
            mailjet
                .post("send", {
                    'version': 'v3.1'
                })
                .request({
                    Messages: [{
                        From: {
                            Email: "no-reply@poiw.org",
                            Name: "po/iw"
                        },
                        To: [{
                            Email: email,
                            Name: fullName || ''
                        }],
                        Subject: subject,
                        TextPart: text,
                        HTMLPart: html || text
                    }]
                })
                .then((result) => {
                    //console.log(result.body.Messages[0].To)
                    resolve()
                })
                .catch((err) => {
                    //console.log(err.statusCode)
                    reject()
                })
        })
    }
}