const express = require("express");
const router = express.Router();
const multer = require("multer");

const { requireRole } = require("../middleware/auth");
const {
  getSeekerProfile,
  updateSeekerProfile,
} = require("../controllers/seekerProfileController");

const upload = multer({ dest: "uploads/" });

router.get("/", requireRole("seeker"), getSeekerProfile);

router.put(
  "/",
  requireRole("seeker"),
  upload.single("profilePic"),
  updateSeekerProfile
);

module.exports = router;
