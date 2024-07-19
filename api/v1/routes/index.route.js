const tasksRoutes = require("./tasks.route");
const usersRoutes = require("./users.route");
const authMiddlware = require("../../../middlewares/auth.middleware");

module.exports = (app) => {
  const version = "/api/v1";
  app.use(`${version}/tasks`, authMiddlware, tasksRoutes);
  app.use(`${version}/users`, usersRoutes);
};
