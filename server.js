const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const recruiterProfileRoutes = require("./routes/recruiterProfileRoutes");
const jobsRoutes = require("./routes/jobsRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://workvibe-frontend.vercel.app",
      "https://workvibe-frontend-dgdkcmn9v-suganthan-s-vs-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/recruiter/profile", recruiterProfileRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/application", applicationRoutes);

app.get("/", (req, res) =>
  res.send("✅ WorkVibe backend is running successfully!")
);

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
