const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ Email: email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      Username: username,
      Email: email,
      Password: hashedPassword,
      Role: role,
    });
    res.status(201).json({ message: "Signup successful, please login" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ Email: email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    req.session.user = {
      id: user._id,
      Email: user.Email,
      Role: user.Role,
      Username: user.Username,
    };
    res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out" });
  });
};
