const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createSeekerProfile,
  getSeekerProfile,
  updateSeekerProfile,
} = require("../controllers/seekerProfileController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

const upload = multer({ storage, fileFilter });

router.get("/", getSeekerProfile);
router.post("/", createSeekerProfile);
router.put("/", upload.single("profilePic"), updateSeekerProfile);

module.exports = router;
