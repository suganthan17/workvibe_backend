const SeekerProfile = require("../models/SeekerProfile");

const createSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const existing = await SeekerProfile.findOne({ userId });
    if (existing)
      return res.status(400).json({ message: "Profile already exists" });

    const profile = new SeekerProfile({
      userId,
      info: { name: req.session.user.name, email: req.session.user.email },
    });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error creating profile" });
  }
};

const getSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const profile = await SeekerProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

const updateSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const profile = await SeekerProfile.findOneAndUpdate({ userId }, req.body, {
      new: true,
      upsert: true,
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

const sidebarInfo = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const profile = await SeekerProfile.findOne(
      { userId },
      { "info.name": 1, "info.email": 1, _id: 0 }
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile.info);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sidebar info" });
  }
};

module.exports = {
  createSeekerProfile,
  getSeekerProfile,
  updateSeekerProfile,
  sidebarInfo,
};
