const RecruiterProfile = require("../models/RecruiterProfile");

exports.createRecruiterProfile = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const existing = await RecruiterProfile.findOne({ userId });
    if (existing) return res.status(400).json({ message: "Profile already exists" });
    const profile = new RecruiterProfile({
      userId,
      basicInfo: {
        name: req.session.user?.username || req.session.user?.name || "",
        email: req.session.user?.email || "",
        position: "",
      },
      companyInfo: { name: "", location: "", logo: "", website: "" },
    });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error creating recruiter profile" });
  }
};

exports.getRecruiterProfile = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const profile = await RecruiterProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recruiter profile" });
  }
};

exports.updateRecruiterProfile = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const updates = {};
    if (req.body.basicInfo) {
      try {
        updates.basicInfo = JSON.parse(req.body.basicInfo);
      } catch {
        updates.basicInfo = req.body.basicInfo;
      }
    }
    if (req.body.companyInfo) {
      try {
        updates.companyInfo = JSON.parse(req.body.companyInfo);
      } catch {
        updates.companyInfo = req.body.companyInfo;
      }
    }
    if (req.file) {
      if (!updates.companyInfo) updates.companyInfo = {};
      updates.companyInfo.logo = req.file.path.replace(/\\/g, "/");
    }
    const profile = await RecruiterProfile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error updating recruiter profile" });
  }
};
