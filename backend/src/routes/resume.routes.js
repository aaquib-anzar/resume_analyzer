const {uploadResume, analyzeResume, matchResume,  history} = require("../controller/resume.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const express = require("express")
const router = express.Router()
const upload = require("../config/multer")

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume)
router.post("/analyze", authMiddleware, analyzeResume)
router.post("/match", authMiddleware, matchResume)
router.get("/history", authMiddleware, history)

module.exports = router