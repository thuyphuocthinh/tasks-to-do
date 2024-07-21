import { Express } from "express";
import usersRoutes from "./users.route";
import tasksRoutes from "./tasks.route";
import * as authMiddlware from "../../../middlewares/auth.middleware";

const routesVersion1 = (app: Express): void => {
  const version = "/api/v1";
  app.use(`${version}/tasks`, authMiddlware.requireAuth, tasksRoutes);
  app.use(`${version}/users`, usersRoutes);
};

export default routesVersion1;
