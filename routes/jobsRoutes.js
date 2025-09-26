  const express = require("express");
  const router = express.Router();
  const {
    postjob,
    getJobs,
    getJobById,
    deleteJob,
    getalljobs,
    savejobs,
    getSavedJobs
  } = require("../controllers/jobsController");

  router.post("/postjob", postjob);
  router.get("/getjobs", getJobs);
  router.get("/getjob/:id", getJobById);
  router.delete("/deletejobs/:id", deleteJob);
  router.get("/getalljobs", getalljobs);
  router.post("/savejobs/:id", savejobs);
  router.get("/savedjobs", getSavedJobs);

  module.exports = router;
