const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  company: {
    name: String,
    industry: String,
    size: String,
    location: String,
  },
  contact: {
    name: String,
    email: String,
    phone: String,
  },
  about: { type: String },
  jobs: { type: String },
});

module.exports=mongoose.model("RecruiterProfile",recruiterProfileSchema);