const express = require("express");
const router = express.Router();

const {
  applyForJob,
  getApplicantsByJob,
  getApplicationsForRecruiter,
  updateApplicationStatus,
  getMyApplications,
  getMyApplicationsCount,
} = require("../controllers/applicationController");

/* JOB SEEKER */
router.post("/apply", applyForJob);
router.get("/seeker/applications", getMyApplications);
router.get("/seeker/applications/count", getMyApplicationsCount);

/* RECRUITER */
router.get("/:jobId/applicants", getApplicantsByJob);
router.get("/recruiter/all", getApplicationsForRecruiter);
router.put("/update/:id", updateApplicationStatus);

module.exports = router;
