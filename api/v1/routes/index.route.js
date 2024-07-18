const tasksRoutes = require("./tasks.route");

module.exports = (app) => {
  const version = "/api/v1";
  app.use(`${version}/tasks`, tasksRoutes);
};
