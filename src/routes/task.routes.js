const express = require("express");
const { Task, User } = require("../models");
const { authenticateJWT, authorizeRoles } = require("../middleware/auth");
const router = express.Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validation");
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("Manager", "Admin"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("priority")
      .isIn(["Low", "Medium", "High"])
      .withMessage("Invalid priority value"),
    body("dueDate").isISO8601().toDate().withMessage("Invalid date format"),
    body("assignedTo")
      .isInt()
      .withMessage("AssignedTo must be a valid user ID"),
  ],
  validate,
  async (req, res) => {
    const { title, description, priority, dueDate, assignedTo } = req.body;
    try {
      const user = await User.findByPk(assignedTo);
      if (!user) {
        return res.status(404).json({ message: "Assigned user not found" });
      }

      const task = await Task.create({
        title,
        description,
        status: "Pending",
        priority,
        dueDate,
        assignedTo,
        createdBy: req.user.id,
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: "Error creating task", error });
    }
  }
);

router.get("/", authenticateJWT, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "Admin") {
      tasks = await Task.findAll();
    } else {
      tasks = await Task.findAll({ where: { assignedTo: req.user.id } });
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

router.patch("/:id/status", authenticateJWT, async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, assignedTo: req.user.id },
    });
    if (!task) {
      return res
        .status(403)
        .json({ message: "You can only update tasks assigned to you" });
    }
    task.status = status;
    await task.save();
    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(400).json({ message: "Error updating task status", error });
  }
});

router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (req.user.role === "Manager" && task.createdBy !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You can only delete tasks you created" });
      }

      await task.destroy();
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting task", error });
    }
  }
);

module.exports = router;
