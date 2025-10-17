// models/RecruiterProfile.js
const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  basicInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    position: { type: String, required: true },
  },
  companyInfo: {
    name: { type: String, required: true },
    location: { type: String, required: true },
    logo: { type: String }, // URL or file path to the logo
    website: { type: String },
  },
});

module.exports = mongoose.model("RecruiterProfile", recruiterProfileSchema);
