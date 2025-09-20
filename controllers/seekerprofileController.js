const SeekerProfile = require("../models/SeekerProfile");

// Create profile
const createSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const existing = await SeekerProfile.findOne({ userId });
    if (existing) return res.status(400).json({ message: "Profile already exists" });

    const profile = new SeekerProfile({ userId });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error creating profile", err });
  }
};

// Get full profile
const getSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const profile = await SeekerProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", err });
  }
};

// Update profile
const updateSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const data = req.body;

    const profile = await SeekerProfile.findOneAndUpdate(
      { userId },
      data,
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", err });
  }
};

// Sidebar info
const sidebarInfo = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const profile = await SeekerProfile.findOne(
      { userId },
      { "info.name": 1, "info.email": 1, _id: 0 }
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({
      name: profile.info.name,
      email: profile.info.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching sidebar info", err });
  }
};

module.exports = {
  createSeekerProfile,
  getSeekerProfile,
  updateSeekerProfile,
  sidebarInfo,
};
