const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const seekerProfileRoutes = require("./routes/seekerprofileRoutes");
const postjobRoutes = require("./routes/postjobRoutes");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "https://workvibe-frontend.vercel.app", // deployed frontend
    ],
    credentials: true, // allow cookies
  })
);

app.use(express.json());

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Routes
app.use("/api/auth", userRoutes); // login/signup
app.use("/api/seeker/profile", seekerProfileRoutes);
app.use("/api/jobs", postjobRoutes);

app.get("/", (req, res) => res.send("Backend is running"));

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
