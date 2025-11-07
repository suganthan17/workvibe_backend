const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getApplicantsByJob,
  getApplicationsForRecruiter,
  updateApplicationStatus,
} = require("../controllers/applicationController");

router.post("/apply", applyForJob);
router.get("/:jobId/applicants", getApplicantsByJob);
router.get("/recruiter/all", getApplicationsForRecruiter);
router.put("/update/:id", updateApplicationStatus);

module.exports = router;
