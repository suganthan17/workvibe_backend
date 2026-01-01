const Application = require("../models/Application");
const Job = require("../models/Job");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });

exports.applyForJob = [
  upload.single("resume"),
  async (req, res) => {
    try {
      const { jobId } = req.body;
      const userId = req.session?.user?.id;

      if (!userId)
        return res.status(401).json({ message: "Unauthorized" });

      if (!req.file)
        return res.status(400).json({ message: "Resume is required" });

      const existingApp = await Application.findOne({ jobId, userId });
      if (existingApp)
        return res.status(400).json({ message: "Already applied" });

      const newApp = new Application({
        jobId,
        userId,
        resumeUrl: `/uploads/resumes/${req.file.filename}`,
      });

      await newApp.save();
      res.status(201).json({ message: "Applied successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized" });

    const applications = await Application.find({ userId })
      .populate("jobId", "jobTitle location")
      .sort({ appliedAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId })
      .populate("userId", "Username Email")
      .sort({ appliedAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApplicationsForRecruiter = async (req, res) => {
  try {
    const recruiterId = req.session?.user?.id;
    if (!recruiterId)
      return res.status(401).json({ message: "Unauthorized" });

    const jobs = await Job.find({ postedBy: recruiterId }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({
      jobId: { $in: jobIds },
    })
      .populate("userId", "Username Email")
      .populate("jobId", "jobTitle")
      .sort({ appliedAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["Applied", "Hired", "Rejected"];
    if (!validStatus.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const app = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!app)
      return res.status(404).json({ message: "Application not found" });

    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyApplicationsCount = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized" });

    const count = await Application.countDocuments({ userId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.hasApplied = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    const { jobId } = req.params;

    if (!userId) return res.json({ applied: false });

    const exists = await Application.findOne({ userId, jobId });
    res.json({ applied: !!exists });
  } catch {
    res.status(500).json({ applied: false });
  }
};
