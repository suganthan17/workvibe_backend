const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createSeekerProfile,
  getSeekerProfile,
  updateSeekerProfile,
  uploadWorkvibeResume,
} = require("../controllers/seekerProfileController");

// ✅ Multer setup
const upload = multer({ dest: "uploads/" });

// ✅ Routes
router.get("/", getSeekerProfile);
router.post("/", createSeekerProfile);
router.put("/", upload.fields([{ name: "profilePic" }]), updateSeekerProfile);
router.put("/workvibe", upload.fields([{ name: "workvibeResume" }]), uploadWorkvibeResume);

module.exports = router;
