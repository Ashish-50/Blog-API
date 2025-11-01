const mongoose = require("mongoose");
const slug = require("slug");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
    default: "#3B82F6",
  },
  postsCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slug(this.name);
  }
  next();
});

categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1, postsCount: -1 });

module.exports = mongoose.model("Category", categorySchema);
