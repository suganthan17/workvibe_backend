const SeekerProfile = require("../models/SeekerProfile");

exports.getSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;

    let profile = await SeekerProfile.findOne({ userId });

    if (!profile) {
      profile = await SeekerProfile.create({
        userId,
        basicInfo: {
          email: req.session.user.Email,
        },
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

exports.updateSeekerProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const updateData = {};

    if (req.body.basicInfo) {
      updateData.basicInfo =
        typeof req.body.basicInfo === "string"
          ? JSON.parse(req.body.basicInfo)
          : req.body.basicInfo;
    }

    if (req.body.locationInfo) {
      updateData.locationInfo =
        typeof req.body.locationInfo === "string"
          ? JSON.parse(req.body.locationInfo)
          : req.body.locationInfo;
    }

    if (req.body.linkedin) {
      updateData.linkedin = req.body.linkedin;
    }

    if (req.file) {
      updateData.profilePic = req.file.path;
    }

    const profile = await SeekerProfile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};
