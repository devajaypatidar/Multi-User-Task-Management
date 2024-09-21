const express = require("express");
const { Team, TeamMembers, User } = require("../models");
const { authenticateJWT, authorizeRoles } = require("../middleware/auth");
const router = express.Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validation");
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("Manager", "Admin"),
  [body("name").notEmpty().withMessage("Team name is required")],
  validate,
  async (req, res) => {
    const { name } = req.body;
    try {
      const team = await Team.create({
        name,
        managerId: req.user.id,
      });
      res.status(201).json(team);
    } catch (error) {
      res.status(400).json({ message: "Error creating team", error });
    }
  }
);
router.post(
  "/:teamId/assign",
  authenticateJWT,
  authorizeRoles("Manager", "Admin"),
  [body("userId").isInt().withMessage("User ID must be an integer")],
  validate,
  async (req, res) => {
    const { userId } = req.body;
    const { teamId } = req.params;

    try {
      const team = await Team.findByPk(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      if (req.user.role === "Manager" && team.managerId !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You can only assign users to your own team" });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await TeamMembers.create({
        TeamId: teamId,
        UserId: userId,
        role: "Member",
      });

      res.status(201).json({ message: "User assigned to team successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error assigning user to team", error });
    }
  }
);

router.get(
  "/",
  authenticateJWT,
  authorizeRoles("Manager", "Admin"),
  async (req, res) => {
    try {
      let teams;
      if (req.user.role === "Admin") {
        teams = await Team.findAll();
      } else if (req.user.role === "Manager") {
        teams = await Team.findAll({ where: { managerId: req.user.id } });
      }
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Error fetching teams", error });
    }
  }
);

module.exports = router;
