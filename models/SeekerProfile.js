const mongoose = require("mongoose");

const SeekerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  profilePic: String,
  basicInfo: {
    fullName: String,
    email: String,
    phone: String,
    dob: String,
  },
  locationInfo: {
    address: String,
    city: String,
    state: String,
    country: String,
  },
  linkedin: String,
});

module.exports = mongoose.model("SeekerProfile", SeekerProfileSchema);
