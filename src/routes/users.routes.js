const express = require("express");
const { User } = require("../models");
const { authenticateJWT, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.get("/", authenticateJWT, authorizeRoles("Admin"), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

router.patch(
  "/:id/role",
  authenticateJWT,
  authorizeRoles("Admin"),
  async (req, res) => {
    const { role } = req.body;
    const { id } = req.params;
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }
    const validRoles = ["Admin", "Manager", "User"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Role must be one of ${validRoles.join(", ")}`,
      });
    }
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = role;
      await user.save();

      res.status(200).json({
        message: "User role updated successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating user role", error });
    }
  }
);

module.exports = router;
