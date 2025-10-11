const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controllers/userController");

// ✅ All endpoints under /api/users
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
