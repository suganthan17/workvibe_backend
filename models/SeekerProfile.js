const mongoose = require("mongoose");

const SeekerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  info: {
    name: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    other_links: String,
  },
  bio: String,
  education: {
    degree: String,
    institution: String,
    yearofgraduation: String,
    cgpa: String,
  },
  technicalskills: String,
  softskills: String,
  experience: {
    companyname: String,
    timeperiod: String,
    position: String,
  },
  projects: String,
  achievements: String,
  additionaldetails: {
    languagesknown: String,
    interests: String,
  },
  profilePic: String,
  resume: String,
  workvibeResume: String,
});

module.exports = mongoose.model("SeekerProfile", SeekerProfileSchema);
