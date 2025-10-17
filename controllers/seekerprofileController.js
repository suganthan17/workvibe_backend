const SeekerProfile = require("../models/SeekerProfile");

exports.createSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const existing = await SeekerProfile.findOne({ userId });
    if (existing) return res.status(400).json({ message: "Profile already exists" });

    const profile = new SeekerProfile({
      userId,
      info: { name: req.session.user.Username, email: req.session.user.Email },
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error creating profile" });
  }
};

exports.getSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const profile = await SeekerProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

exports.updateSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const updates = {};

    ["basicInfo", "locationInfo"].forEach((key) => {
      if (req.body[key]) updates[key] = JSON.parse(req.body[key]);
    });

    if (req.body.linkedin) updates.linkedin = req.body.linkedin;
    if (req.file) updates.profilePic = req.file.path;

    const profile = await SeekerProfile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

