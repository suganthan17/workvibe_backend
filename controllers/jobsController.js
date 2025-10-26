const Job = require("../models/Job");
const RecruiterProfile = require("../models/RecruiterProfile");

exports.postjob = async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    let logo = "";
    const profile = await RecruiterProfile.findOne({ userId: req.session.user.id }).lean();
    if (profile) logo = profile.companyInfo?.logo || "";
    const newJob = new Job({ ...req.body, postedBy: req.session.user.id, companyLogo: logo });
    await newJob.save();
    res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (!job.companyLogo && job.postedBy) {
      const profile = await RecruiterProfile.findOne({ userId: job.postedBy }).lean();
      if (profile) job.companyLogo = profile.companyInfo?.logo || null;
    }
    res.status(200).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, message: "Removed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getalljobs = async (req, res) => {
  try {
    const jobs = await Job.find().lean();
    const posterIds = [...new Set(jobs.map(j => j.postedBy && String(j.postedBy)).filter(Boolean))];
    const profiles = posterIds.length ? await RecruiterProfile.find({ userId: { $in: posterIds } }).lean() : [];
    const map = {};
    profiles.forEach(p => { map[String(p.userId)] = p.companyInfo?.logo || null; });
    const jobsWithLogo = jobs.map(job => {
      const logo = job.companyLogo || (job.postedBy ? map[String(job.postedBy)] : null) || null;
      return { ...job, companyLogo: logo };
    });
    res.status(200).json({ success: true, jobs: jobsWithLogo, currentUserId: req.session?.user?.id || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
      job.savedBy = job.savedBy.filter(id => id.toString() !== userId);
    } else {
      job.savedBy.push(userId);
    }
    await job.save();
    res.status(200).json({ success: true, savedBy: job.savedBy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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

exports.getAppliedJobs = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false });
  res.status(200).json({ success: true, jobs: [], message: "Applied jobs feature coming soon" });
};
