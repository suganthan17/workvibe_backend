const Job = require("../models/Job");
const RecruiterProfile = require("../models/RecruiterProfile");

exports.postjob = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    const profile = await RecruiterProfile.findOne({ userId: req.session.user.id }).lean();
    const companyName = req.body.companyName || profile?.companyInfo?.name || "";
    const location = req.body.location || profile?.companyInfo?.location || "";
    const companyLogo = profile?.companyInfo?.logo || req.body.companyLogo || "";
    const jobPayload = {
      ...req.body,
      companyName,
      location,
      companyLogo,
      postedBy: req.session.user.id,
    };
    const newJob = new Job(jobPayload);
    await newJob.save();
    res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getJobs = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false, message: "Unauthorized" });
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
    if ((!job.companyLogo || !job.companyName || !job.location) && job.postedBy) {
      const profile = await RecruiterProfile.findOne({ userId: job.postedBy }).lean();
      job.companyLogo = job.companyLogo || profile?.companyInfo?.logo || null;
      job.companyName = job.companyName || profile?.companyInfo?.name || "Unknown Company";
      job.location = job.location || profile?.companyInfo?.location || "Location not specified";
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
    const posterIds = [
      ...new Set(
        jobs
          .map((j) => (j.postedBy ? String(j.postedBy) : null))
          .filter(Boolean)
      ),
    ];
    const profiles = posterIds.length ? await RecruiterProfile.find({ userId: { $in: posterIds } }).lean() : [];
    const infoMap = {};
    profiles.forEach((p) => {
      infoMap[String(p.userId)] = p.companyInfo || {};
    });
    const jobsWithCompany = jobs.map((job) => {
      const postedById = job.postedBy ? String(job.postedBy) : null;
      const profileInfo = postedById ? infoMap[postedById] || {} : {};
      const companyName = job.companyName || profileInfo.name || "Unknown Company";
      const location = job.location || profileInfo.location || "Location not specified";
      const companyLogo = job.companyLogo || profileInfo.logo || null;
      return {
        ...job,
        companyName,
        location,
        companyLogo,
      };
    });
    res.status(200).json({
      success: true,
      jobs: jobsWithCompany,
      currentUserId: req.session?.user?.id || null,
    });
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
