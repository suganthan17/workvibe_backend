const PostJob = require("../models/postjob");

exports.postjob = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const newJob = new PostJob({
      ...req.body,
      postedBy: req.session.user.id,
    });

    await newJob.save();
    res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const jobs = await PostJob.find({ postedBy: req.session.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await PostJob.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }
    res.status(200).json({ message: "removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.getalljobs = async (req, res) => {
  try {
    const jobs = await PostJob.find(); 
    res.status(200).json({ jobs }); 
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await PostJob.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
