import axios from "axios"

module.exports = {
    validate:(response)=>{
        return new Promise((resolve,reject)=>{
            axios
                .get(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.recaptcha}&response=${response}`)
                .then(({data:{success}})=>{
                    if(success) resolve(true)
                    else reject(false)
                })
                .catch(e=>{
                    //console.log(e.message)
                    reject(false)
                })
        })
    }
}