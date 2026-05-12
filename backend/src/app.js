const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const resumeRoutes = require("./routes/resume.routes");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173","https://resume-analyzer-nine-amber.vercel.app",
];
app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

module.exports = app;
