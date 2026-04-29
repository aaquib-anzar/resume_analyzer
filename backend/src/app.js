const express = require("express")
const cookieParser = require("cookie-parser")
const multer = require("multer")
const authRoutes = require("./routes/auth.route")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)

const upload = multer({storage:multer.memoryStorage()})

module.exports = app