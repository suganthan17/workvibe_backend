const Application = require("../models/Application");
const Job = require("../models/Job");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

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
      const userId = req.session?.user?.id || req.body?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
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

exports.getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ jobId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApplicationsForRecruiter = async (req, res) => {
  try {
    const recruiterId = req.session?.user?.id || req.query.recruiterId;
    if (!recruiterId) return res.status(401).json({ message: "Unauthorized" });
    const jobs = await Job.find({ postedBy: recruiterId }).select("_id");
    if (!jobs.length) return res.json({ applications: [] });
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("userId", "Username Email")

      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ["Applied", "Hired", "Rejected"];
    if (!valid.includes(status))
      return res.status(400).json({ message: "Invalid status" });
    const app = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
