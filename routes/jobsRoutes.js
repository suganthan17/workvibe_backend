const express = require("express");
const router = express.Router();
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
router.post("/postjob", postjob);
router.get("/getjobs", getJobs);
router.get("/getjob/:id", getJobById);
router.delete("/deletejobs/:id", deleteJob);

// Seeker routes
router.get("/getalljobs", getalljobs);
router.post("/savejobs/:id", savejobs);
router.get("/savedjobs", getSavedJobs);
router.get("/applied", getAppliedJobs);

module.exports = router;
