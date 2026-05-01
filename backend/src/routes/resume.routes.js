const {uploadResume, analyzeResume, matchResume} = require("../controller/resume.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const express = require("express")
const router = express.Router()
const upload = require("../config/multer")

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume)
router.post("/analyze", authMiddleware, analyzeResume)
router.post("/match", authMiddleware, matchResume
)

module.exports = router