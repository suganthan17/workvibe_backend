const Job = require("../models/jobs");

// Post a new job (Recruiter only)
exports.postjob = async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const newJob = new Job({ ...req.body, postedBy: req.session.user.id });
    await newJob.save();
    res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all jobs posted by the current recruiter
exports.getJobs = async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const jobs = await Job.find({ postedBy: req.session.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all jobs (for seekers)
exports.getalljobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    const currentUserId = req.session?.user?.id || null;
    res.status(200).json({ jobs, currentUserId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
      if (!job.savedBy) job.savedBy = [];
      job.savedBy.push(userId);
    }

    await job.save();
    res.status(200).json({ success: true, savedBy: job.savedBy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.getSavedJobs = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false });

  const userId = req.session.user.id;
  try {
    const jobs = await Job.find({ savedBy: userId });
    res.status(200).json({ jobs, currentUserId: userId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
