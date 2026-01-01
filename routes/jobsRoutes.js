const express = require("express");
const router = express.Router();
const { requireRole } = require("../middleware/auth");

const {
  postjob,
  getJobs,
  getJobById,
  deleteJob,
  getalljobs,
  savejobs,
  getSavedJobs,
  getAppliedJobs,
} = require("../controllers/jobsController");

// Recruiter routes
router.post("/postjob", requireRole("recruiter"), postjob);
router.get("/getjobs", requireRole("recruiter"), getJobs);
router.delete("/deletejobs/:id", requireRole("recruiter"), deleteJob);

// Public routes
router.get("/getjob/:id", getJobById);
router.get("/getalljobs", getalljobs);

// Seeker routes
router.post("/savejobs/:id", requireRole("seeker"), savejobs);
router.get("/savedjobs", requireRole("seeker"), getSavedJobs);
router.get("/applied", requireRole("seeker"), getAppliedJobs);

module.exports = router;
