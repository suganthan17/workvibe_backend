const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controllers/userController");
const { requireRole } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes examples
router.get("/seeker-dashboard", requireRole("seeker"), (req, res) => {
  res.json({ message: "Welcome Seeker!" });
});

router.get("/recruiter-dashboard", requireRole("recruiter"), (req, res) => {
  res.json({ message: "Welcome Recruiter!" });
});

module.exports = router;
