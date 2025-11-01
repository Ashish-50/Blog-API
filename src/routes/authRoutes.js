const express = require("express");
const router = express.Router();
const { userValidator } = require("../validator/userValidator");
const {
  register,
  login,
  logout,
  getProfile,
} = require("../controllers/authController");

const { authenticate } = require("../middleware/auth");

router.post("/register", userValidator, register);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.get("/profile", authenticate, getProfile);

module.exports = router;
