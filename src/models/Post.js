const mongoose = require("mongoose");
const slug = require("slug");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    maxlength: 300,
  },
  featuredImage: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  visibility: {
    type: String,
    enum: ["public", "private", "unlisted"],
    default: "public",
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  bookmarksCount: {
    type: Number,
    default: 0,
  },
  readTime: {
    type: Number, // in minutes
    default: 5,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  publishedAt: Date,
  lastEditedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate slug before saving
postSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slug(this.title) + "-" + Date.now();
  }

  // Calculate read time (average reading speed: 200 words per minute)
  if (this.isModified("content")) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }

  next();
});

// Indexes
postSchema.index({ slug: 1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ status: 1, visibility: 1, publishedAt: -1 });
postSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Post", postSchema);
