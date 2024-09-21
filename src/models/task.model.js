const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Pending", "In Progress", "Completed"),
    defaultValue: "Pending",
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM("Low", "Medium", "High"),
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Task;
