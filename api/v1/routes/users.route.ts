import * as express from "express";
import * as controller from "../../../controllers/users.controller";
const router: express.Router = express.Router();

// middleware
import { requireAuth } from "../../../middlewares/auth.middleware";

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/password/forgot", controller.forgotPassword);
router.post("/password/otp", controller.otp);
router.post("/password/reset", controller.resetPassword);
router.get("/profile", requireAuth, controller.getProfile);
router.get("/", requireAuth, controller.index);

export default router;
