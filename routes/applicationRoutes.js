const express = require("express");
const router = express.Router();
const { requireRole } = require("../middleware/auth");

const {
  applyForJob,
  getApplicantsByJob,
  getApplicationsForRecruiter,
  updateApplicationStatus,
  getMyApplications,
  getMyApplicationsCount,
  hasApplied,
} = require("../controllers/applicationController");

router.post("/apply", requireRole("seeker"), applyForJob);
router.get("/seeker/applications", requireRole("seeker"), getMyApplications);
router.get(
  "/seeker/applications/count",
  requireRole("seeker"),
  getMyApplicationsCount
);
router.get(
  "/seeker/has-applied/:jobId",
  requireRole("seeker"),
  hasApplied
);

router.get("/:jobId/applicants", requireRole("recruiter"), getApplicantsByJob);
router.get(
  "/recruiter/all",
  requireRole("recruiter"),
  getApplicationsForRecruiter
);
router.put(
  "/update/:id",
  requireRole("recruiter"),
  updateApplicationStatus
);

module.exports = router;
