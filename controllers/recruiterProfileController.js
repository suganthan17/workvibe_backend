const RecruiterProfile = require("../models/RecruiterProfile");

exports.createRecruiterProfile = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const existing = await RecruiterProfile.findOne({ userId });
    if (existing)
      return res.status(400).json({ message: "Profile already exists" });
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

exports.getRecruiterProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const profile = await RecruiterProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({ success: true, profile });
  } catch (err) {
    console.error("Error fetching recruiter profile by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.updateRecruiterProfile = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const profile = await RecruiterProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    if (req.body.basicInfo) {
      const basicInfo = JSON.parse(req.body.basicInfo);
      Object.assign(profile.basicInfo, basicInfo);
    }

    if (req.body.companyInfo) {
      const companyInfo = JSON.parse(req.body.companyInfo);
      Object.assign(profile.companyInfo, companyInfo);
    }

    if (req.file) {
      profile.companyInfo.logo = req.file.path.replace(/\\/g, "/");
    }

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error updating recruiter profile" });
  }
};
