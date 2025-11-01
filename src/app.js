const express = require("express");
const connectDB = require("./config/database");
const { connectRedis } = require("./config/redis");

const authRoutes = require("./routes/authRoutes");
// const postRoutes = require("./routes/postRoutes");
// const analyticsRoutes = require("./routes/analyticsRoutes");

// const rateLimiter = require("./middleware/rateLimiter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
connectRedis();

// app.use("/api", rateLimiter);

app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/analytics", analyticsRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
