const mongoose = require("mongoose");

const dbConnect = async()=>{
    try {
        const connection = await mongoose.connect(process.env.database_url,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log("connected to database")
    } catch (error) {
        console.log(`failed db connection`)
    }
}

module.exports = dbConnect;