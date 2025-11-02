const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  basicInfo: {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    position: { type: String, default: "" },
  },
  companyInfo: {
    name: { type: String, default: "" },
    location: { type: String, default: "" },
    logo: { type: String, default: "" }, 
    website: { type: String, default: "" },
  },
});

module.exports = mongoose.model("RecruiterProfile", recruiterProfileSchema);
