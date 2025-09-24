const express = require("express");
const router = express.Router();
const {
  createSeekerProfile,
  getSeekerProfile,
  updateSeekerProfile,
  sidebarInfo,
} = require("../controllers/seekerprofileController");

router.post("/", createSeekerProfile);
router.get("/", getSeekerProfile);
router.put("/", updateSeekerProfile);
router.get("/sidebar", sidebarInfo);

module.exports = router;
