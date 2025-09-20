const express = require("express");
const router = express.Router();
const {
  postjob,
  getJobs,
  getJobById,
  deleteJob,
  getalljobs
} = require("../controllers/jobController");

router.post("/postjob", postjob);
router.get("/getjobs", getJobs);
router.delete("/deletejobs/:id", deleteJob);
router.get("/getalljobs", getalljobs);
router.get("/getjob/:id", getJobById);

module.exports = router;
