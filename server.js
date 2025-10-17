const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const seekerProfileRoutes = require("./routes/seekerprofileRoutes");
const recruiterprofileRoutes= require("./routes/recruiterProfileRoutes")
const jobsRoutes = require("./routes/jobsRoutes");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://workvibe-frontend.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoutes);
app.use("/api/seeker/profile", seekerProfileRoutes);
app.use("/api/recruiter/profile",recruiterprofileRoutes)
app.use("/api/jobs", jobsRoutes);

app.get("/", (req, res) => res.send("Backend is running"));

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
