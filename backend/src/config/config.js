require("dotenv").config()

if(!process.env.MONGO_URI){
    console.log("MONGO_URI is not defined in .env file")
    process.exit(1)
}
if(!process.env.JWT_SECRET){
    console.log("JWT_SECRET is not defined in .env file")
    process.exit(1)
}
if(!process.env.GEMINI_API_KEY){
    console.log("GEMINI_API_KEY is not defined in .env file")
    process.exit(1)
}

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
}