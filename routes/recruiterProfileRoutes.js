const express = require("express");
const router = express.Router();
const multer = require("multer");
const { requireRole } = require("../middleware/auth");
const RecruiterProfile = require("../models/RecruiterProfile");
const {
  getRecruiterProfile,
  updateRecruiterProfile,
} = require("../controllers/recruiterProfileController");

const upload = multer({ dest: "uploads/" });

/* =======================
   PRIVATE (Recruiter)
======================= */
router.get("/", requireRole("recruiter"), getRecruiterProfile);

router.put(
  "/",
  requireRole("recruiter"),
  upload.single("logo"),
  updateRecruiterProfile
);

/* =======================
   PUBLIC (Job Details)
======================= */
router.get("/public/:userId", async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({
      userId: req.params.userId,
    }).lean();

    if (!profile) {
      return res.status(404).json({ message: "Recruiter profile not found" });
    }

    res.status(200).json({
      companyName: profile.companyInfo?.name || "",
      companyLocation: profile.companyInfo?.location || "",
      companyLogo: profile.companyInfo?.logo || "",
      email: profile.basicInfo?.email || "",
      website: profile.companyInfo?.website || "",
    });
  } catch (err) {
    console.error("Public recruiter fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
