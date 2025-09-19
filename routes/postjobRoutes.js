// backend/routes/postjobRoutes.js
const express = require("express");
const router = express.Router();
const {
  postjob,
  getJobs,
  getJobById,
  deleteJob,
  getalljobs
} = require("../controllers/jobController");

// POST a new job
router.post("/postjob", postjob);

// GET all jobs
router.get("/getjobs", getJobs);

//DELETE a job
router.delete("/deletejobs/:id",deleteJob)

router.get("/getalljobs",getalljobs)

// GET a single job by ID
router.get("/getjob/:id", getJobById);

module.exports = router;
