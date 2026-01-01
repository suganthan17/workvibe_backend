const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });

  res.json(req.session.user);
});

module.exports = router;
