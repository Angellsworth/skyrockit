const mongoose = require("mongoose");

// Define the User schema first
// Define the Application schema separately (if you intended to use it)
const applicationSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  postingLink: {
    type: String,
  },
  status: {
    type: String,
    enum: ['interested', 'applied', 'interviewing', 'rejected', 'accepted'],
  },
});
const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  password: { type: String, required: true }, // Store hashed password
  applications: [applicationSchema],// Embedding applications as an array of objects
  createdAt: { type: Date, default: Date.now }
});


// Create models from schemas
const User = mongoose.model("User", userSchema);

module.exports = User;