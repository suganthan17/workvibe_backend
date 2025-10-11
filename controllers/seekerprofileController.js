const SeekerProfile = require("../models/SeekerProfile");

// ✅ Create profile
exports.createSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const existing = await SeekerProfile.findOne({ userId });
    if (existing)
      return res.status(400).json({ message: "Profile already exists" });

    const profile = new SeekerProfile({
      userId,
      info: { name: req.session.user.Username, email: req.session.user.Email },
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating profile" });
  }
};

// ✅ Get profile
exports.getSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const profile = await SeekerProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// ✅ Update profile
exports.updateSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const updates = {};

    [
      "info",
      "bio",
      "education",
      "technicalskills",
      "softskills",
      "experience",
      "projects",
      "achievements",
      "additionaldetails",
    ].forEach((key) => {
      if (req.body[key]) {
        try {
          updates[key] = JSON.parse(req.body[key]);
        } catch {
          updates[key] = req.body[key];
        }
      }
    });

    if (req.files && req.files.profilePic)
      updates.profilePic = req.files.profilePic[0].path;

    const profile = await SeekerProfile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// ✅ Upload WorkVibe Resume
exports.uploadWorkvibeResume = async (req, res) => {
  try {
    if (!req.files || !req.files.workvibeResume)
      return res.status(400).json({ message: "No file uploaded" });

    const userId = req.session.user.id;
    const profile = await SeekerProfile.findOneAndUpdate(
      { userId },
      { workvibeResume: req.files.workvibeResume[0].path },
      { new: true }
    );

    res.json({ message: "WorkVibe resume uploaded", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading resume" });
  }
};
