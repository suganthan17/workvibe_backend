const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  const { Username, Email, Password, Role } = req.body;

  try {
    const exists = await User.findOne({ Email });
    if (exists) return res.status(400).json({ message: "Email exists" });

    const hashed = await bcrypt.hash(Password, 10);
    await User.create({ Username, Email, Password: hashed, Role });

    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const user = await User.findOne({ Email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(Password, user.Password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ message: "Session error" });

      req.session.user = {
        id: user._id,
        Username: user.Username,
        Email: user.Email,
        Role: user.Role,
      };

      req.session.save(() => {
        res.json({ message: "Login success" });
      });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("workvibe.sid");
    res.json({ message: "Logged out" });
  });
};
