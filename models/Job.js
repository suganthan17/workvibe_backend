const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["Entry", "Mid", "Senior", "Manager"],
      required: true,
    },
    salaryMin: { type: Number, required: true },
    salaryMax: { type: Number, required: true },
    jobCategory: { type: String, required: true },
    jobDescription: { type: String, required: true },
    responsibilities: { type: String, required: true },
    requirements: { type: String, required: true },
    companyName: { type: String, default: "" },
    location: { type: String, default: "" },
    companyLogo: { type: String, default: "" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
