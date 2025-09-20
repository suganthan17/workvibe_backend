const mongoose = require("mongoose");

const SeekerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  info: {
    name: String,
    email: String,
    phone: String,
    location: String,
  },
  education: {
    degree: String,
    institution: String,
    cgpa: String,
  },
  skills: String,
  experience: String,
  projects: String,
  achievements: String,
  profilePic: String,
});

module.exports = mongoose.model("SeekerProfile", SeekerProfileSchema);
