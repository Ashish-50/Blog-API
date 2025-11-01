const { body } = require("express-validator");
const User = require("../models/User");
const {
  isUsernameTaken,
  addUsernameToCache,
} = require("../services/cacheService");

const userValidator = [
  body("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores")
    .custom(async (value) => {
      const lowerUsername = value.toLowerCase();
      const cachedCheck = await isUsernameTaken(lowerUsername);
      if (cachedCheck) {
        return Promise.reject("Username already taken");
      }
      const existingUser = await User.findOne({
        username: { $regex: new RegExp(`^${lowerUsername}$`, "i") },
      }).select("_id");
      if (existingUser) {
        await addUsernameToCache(lowerUsername);
        return Promise.reject("Username already taken");
      }
      return true;
    }),
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      const existingUser = await User.findOne({
        email: value.toLowerCase(),
      }).select("_id");
      if (existingUser) {
        return Promise.reject("Email already in use");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidator = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  userValidator,
  loginValidator,
};
