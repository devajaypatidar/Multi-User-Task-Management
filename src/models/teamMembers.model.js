const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");
const Team = require("./team.model");

const TeamMembers = sequelize.define(
  "TeamMembers",
  {
    TeamId: {
      type: DataTypes.INTEGER,
      references: {
        model: Team,
        key: "id",
      },
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Member"),
      defaultValue: "Member",
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["TeamId", "UserId"],
      },
    ],
  }
);

module.exports = TeamMembers;
