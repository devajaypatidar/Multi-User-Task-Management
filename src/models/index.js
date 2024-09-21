const User = require("./user.model");
const Task = require("./task.model");
const Team = require("./team.model");
const TeamMembers = require("./teamMembers.model");

User.hasMany(Task, { foreignKey: "createdBy" });
Task.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

User.hasMany(Task, { foreignKey: "assignedTo" });
Task.belongsTo(User, { as: "assignee", foreignKey: "assignedTo" });

User.hasMany(Team, { foreignKey: "managerId" });
Team.belongsTo(User, { as: "manager", foreignKey: "managerId" });

Team.belongsToMany(User, { through: TeamMembers });
User.belongsToMany(Team, { through: TeamMembers });

module.exports = { User, Task, Team, TeamMembers };
