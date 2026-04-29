const mongoose = require("mongoose")
const { MONGO_URI } = require("./config")

async function connectDB(){
    try{
        await mongoose.connect(MONGO_URI) 
        console.log("Connected to database")
    }catch(error){
        console.log("Error connecting to database", error.message)
    }
}
module.exports = connectDB