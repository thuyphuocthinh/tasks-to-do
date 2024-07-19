const express = require("express");
const router = express.Router();
const controller = require("../../../controllers/users.controller");
// middleware
const authMiddlware = require("../../../middlewares/auth.middleware");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/password/forgot", controller.forgotPassword);
router.post("/password/otp", controller.otp);
router.post("/password/reset", controller.resetPassword);
router.get("/profile", authMiddlware, controller.getProfile);
router.get("/", authMiddlware, controller.index);

module.exports = router;
