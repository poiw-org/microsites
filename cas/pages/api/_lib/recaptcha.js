import axios from "axios"

module.exports = {
    validate:(response)=>{
        return new Promise((resolve,reject)=>{
            resolve(true)
            // axios
            //     .get(`https://hcaptcha.com/siteverify?secret=${process.env.hcaptcha}&response=${response}`)
            //     .then(({data:{success}})=>{
            //         if(success) resolve()
            //         else reject()
            //     })
            //     .catch(e=>{
            //         //console.log(e.message)
            //         reject()
            //     })
        })
    }
}