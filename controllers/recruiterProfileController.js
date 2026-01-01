const RecruiterProfile = require("../models/RecruiterProfile");

exports.getRecruiterProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;

    let profile = await RecruiterProfile.findOne({ userId });

    if (!profile) {
      profile = await RecruiterProfile.create({
        userId,
        basicInfo: {
          name: req.session.user.Username || "",
          email: req.session.user.Email || "",
          position: "",
        },
        companyInfo: {
          name: "",
          location: "",
          logo: "",
          website: "",
        },
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recruiter profile" });
  }
};

exports.updateRecruiterProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const updateData = {};

    if (req.body.basicInfo) {
      const basicInfo =
        typeof req.body.basicInfo === "string"
          ? JSON.parse(req.body.basicInfo)
          : req.body.basicInfo;

      Object.keys(basicInfo).forEach((key) => {
        updateData[`basicInfo.${key}`] = basicInfo[key];
      });
    }

    if (req.body.companyInfo) {
      const companyInfo =
        typeof req.body.companyInfo === "string"
          ? JSON.parse(req.body.companyInfo)
          : req.body.companyInfo;

      Object.keys(companyInfo).forEach((key) => {
        updateData[`companyInfo.${key}`] = companyInfo[key];
      });
    }

    if (req.file) {
      updateData["companyInfo.logo"] = req.file.path.replace(/\\/g, "/");
    }

    const profile = await RecruiterProfile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating recruiter profile" });
  }
};
