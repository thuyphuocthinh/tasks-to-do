const express = require("express");
const router = express.Router();
const controller = require("../../../controllers/users.controller");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/password/forgot", controller.forgotPassword);
router.post("/password/otp", controller.otp);
router.post("/password/reset", controller.resetPassword);
router.get("/profile", controller.getProfile);

module.exports = router;
