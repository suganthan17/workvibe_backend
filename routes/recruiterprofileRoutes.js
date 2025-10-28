// routes/recruiterProfileRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createRecruiterProfile,
  getRecruiterProfile,
  updateRecruiterProfile,
  getRecruiterProfileById,
} = require("../controllers/recruiterProfileController");

// ensure upload folder exists
const uploadDir = "uploads/recruiterLogos";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp|svg/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) return cb(null, true);
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
  },
});

router.post("/create", createRecruiterProfile);
router.get("/get", getRecruiterProfile);
router.put("/update", upload.single("logo"), updateRecruiterProfile);
router.get("/get/:userId", getRecruiterProfileById);


module.exports = router;
