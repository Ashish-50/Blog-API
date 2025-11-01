require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
const cacheService = require("./src/services/cacheService");
const { connectRedis } = require("./src/config/redis");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/blogAPI";

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    await connectRedis();
    console.log("✅ Redis connected");
    console.log("✅ Connected to MongoDB");

    const totalUsers = 100000;
    const authorsCount = 10;
    const adminsCount = 2;
    const defaultPassword = "password123";

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const users = [];

    // ➤ Create 2 admins
    for (let i = 1; i <= adminsCount; i++) {
      users.push({
        username: `Admin${i}`,
        email: `admin${i}@example.com`,
        password: hashedPassword,
        profileImage: "default-avatar.png",
        role: "admin",
        isVerified: true,
        followers: 0,
        following: 0,
        totalPosts: 0,
        totalViews: 0,
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
        },
      });
    }

    // ➤ Create 10 authors
    for (let i = 1; i <= authorsCount; i++) {
      users.push({
        username: `Author${i}`,
        email: `author${i}@example.com`,
        password: hashedPassword,
        profileImage: "default-avatar.png",
        role: "author",
        isVerified: true,
        followers: 0,
        following: 0,
        totalPosts: 0,
        totalViews: 0,
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
        },
      });
    }

    // ➤ Create remaining users (general)
    for (let i = 1; i <= totalUsers - (adminsCount + authorsCount); i++) {
      users.push({
        username: `User${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        profileImage: "default-avatar.png",
        role: "user",
        isVerified: false,
        followers: 0,
        following: 0,
        totalPosts: 0,
        totalViews: 0,
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
        },
      });
    }

    await User.insertMany(users);
    const batchSize = 1000;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await Promise.all(
        batch.map((u) =>
          cacheService.addUsernameToCache(u.username.toLowerCase())
        )
      );
      console.log(`✅ Cached ${i + batch.length}/${users.length} usernames`);
    }
    console.log(`✅ Successfully inserted ${users.length} users`);

    mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    mongoose.disconnect();
  }
}

seedUsers();
