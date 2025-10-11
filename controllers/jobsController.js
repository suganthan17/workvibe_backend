const Job = require("../models/Job");

// Recruiter: Post a new job
exports.postjob = async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const newJob = new Job({ ...req.body, postedBy: req.session.user.id });
    await newJob.save();
    res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Recruiter: Get jobs posted by self
exports.getJobs = async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const jobs = await Job.find({ postedBy: req.session.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, message: "Removed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Seeker: Get all jobs
exports.getalljobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    const currentUserId = req.session?.user?.id || null;
    res.status(200).json({ success: true, jobs, currentUserId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Save or unsave a job
exports.savejobs = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false });

  const jobId = req.params.id;
  const userId = req.session.user.id;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (job.savedBy?.includes(userId)) {
      job.savedBy = job.savedBy.filter((id) => id.toString() !== userId);
    } else {
      job.savedBy.push(userId);
    }

    await job.save();
    res.status(200).json({ success: true, savedBy: job.savedBy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get saved jobs
exports.getSavedJobs = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false });

  const userId = req.session.user.id;
  try {
    const jobs = await Job.find({ savedBy: userId });
    res.status(200).json({ success: true, jobs, currentUserId: userId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Applied jobs (dummy)
exports.getAppliedJobs = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false });
  res.status(200).json({ success: true, jobs: [], message: "Applied jobs feature coming soon" });
};
