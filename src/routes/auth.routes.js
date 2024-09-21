const express = require("express");
const { body } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { validate } = require("../middleware/validation");
const router = express.Router();

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Must be a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validate,
  async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: "User",
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Error registering user", error });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Must be a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  }
);

module.exports = router;
