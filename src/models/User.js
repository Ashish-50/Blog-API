const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  fullName: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  profileImage: {
    type: String,
    default: "default-avatar.png",
  },
  role: {
    type: String,
    enum: ["user", "author", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  followers: {
    type: Number,
    default: 0,
  },
  following: {
    type: Number,
    default: 0,
  },
  totalPosts: {
    type: Number,
    default: 0,
  },
  totalViews: {
    type: Number,
    default: 0,
  },
  socialLinks: {
    twitter: String,
    linkedin: String,
    github: String,
    website: String,
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model("User", userSchema);
