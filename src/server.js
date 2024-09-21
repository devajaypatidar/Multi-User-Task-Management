const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const { User, Task, Team, TeamMembers } = require("./models");
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const usersRoutes = require("./routes/users.routes");
const teamsRoutes = require("./routes/team.routes");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/teams", teamsRoutes);
app.use("/task", taskRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await sequelize.sync({ force: false });
    console.log("Database synced successfully");
    await createAdminUser();
  } catch (error) {
    console.error("Error syncing the database:", error);
  }
});

const createAdminUser = async () => {
  try {
    const admin = await User.findOne({
      where: { email: "ajaypatidar@gmail.com" },
    });
    if (!admin) {
      await User.create({
        username: "ajay",
        email: "ajaypatidar@gmail.com",
        password: "12345678",
        role: "Admin",
      });
      console.log("Admin user created.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};
