const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const seekerProfileRoutes = require("./routes/seekerProfileRoutes");
const recruiterProfileRoutes = require("./routes/recruiterProfileRoutes");
const jobsRoutes = require("./routes/jobsRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

connectDB();

const app = express();
const PORT = 5000;

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    name: "workvibe.sid",
    secret: "workvibe_local_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

app.use("/api/users", userRoutes);
app.use("/api/seeker/profile", seekerProfileRoutes);
app.use("/api/recruiter/profile", recruiterProfileRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/application", applicationRoutes);

app.get("/", (req, res) => {
  res.send("Backend running (LOCAL)");
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:5000");
});
