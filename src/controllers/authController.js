const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cacheService = require("../services/cacheService");
const { validationResult } = require("express-validator");

class AuthController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { username, email, password, role } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role: role || "user",
      });

      await user.save();

      await cacheService.addUsernameToCache(username.toLowerCase());

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { identifier, password } = req.body;

      const query = identifier.includes("@")
        ? { email: identifier }
        : { username: identifier };
      const user = await User.findOne(query).lean();
      if (!user || (await bcrypt.compare(password, user.password)) === false) {
        return res.status(401).json({ error: "Invalid credentials" });
      } // did this because if I check this in validation level I have to reterive data two time and make two db calls

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "24h",
      });

      await cacheService.setSession(token, {
        userId: user._id,
        username: user.username,
        email: user.email,
      });

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      await cacheService.deleteSession(token);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.userId).select("-password");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
