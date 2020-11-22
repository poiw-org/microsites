const karavaki = require('./_lib/karavaki')

module.exports = (req,res) =>{
    if(req.method != 'POST') res.status(400).json({
        message: 'This endpoint receives only POST requests.'
    })

    karavaki()
        .then(async db=>{
            if(!req.body.email){
                res.status(400).json({
                    message: "No email was supplied."
                })
            }

            let {email} = req.body

            let user = await db.collection("users").findOne({email})

            if(user){

                res.json({
                   emailExists: true 
                })

            }else{
                user = await db.collection("pendingRegistrations").findOne({email})

                res.json({
                    emailExists: false,
                    pendingActivation: user ? true : false
                 })
            }
        })
        .catch(e=>{
            //console.log(e)
            res.status(500)
        })
}