const mongo = require('mongodb').MongoClient;

module.exports = async () => {
    return new Promise((resolve,reject)=>{
        mongo.connect(process.env.MONGODB_STRING, {useUnifiedTopology: true}, async (err, client)=>{
            if(err) reject("Couldn\'t connect to the database!")
            let db = client.db("authentication")
            
            resolve(db)
        })
    })
}