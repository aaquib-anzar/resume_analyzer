const express = require("express")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.route")
const resumeRoutes = require("./routes/resume.routes")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/resume", resumeRoutes)

module.exports = app