const tasksRoutes = require("./tasks.route");
const usersRoutes = require("./users.route");

module.exports = (app) => {
  const version = "/api/v1";
  app.use(`${version}/tasks`, tasksRoutes);
  app.use(`${version}/users`, usersRoutes);
};
