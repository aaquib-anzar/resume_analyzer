const {uploadResume} = require("../controller/resume.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const express = require("express")
const router = express.Router()
const upload = require("../config/multer")

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume)

module.exports = router