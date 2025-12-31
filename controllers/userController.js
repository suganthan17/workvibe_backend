const User = require("../models/User");
const bcrypt = require("bcrypt");

// ✅ Signup
exports.signup = async (req, res) => {
  const { Username, Email, Password, Role } = req.body;
  try {
    const existingUser = await User.findOne({ Email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(Password, 10);
    await User.create({ Username, Email, Password: hashedPassword, Role });

    res.status(201).json({ message: "Signup successful, please login" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const user = await User.findOne({ Email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    req.session.user = {
      id: user._id,
      Email: user.Email,
      Role: user.Role,
      Username: user.Username,
    };

    res.status(200).json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
};
