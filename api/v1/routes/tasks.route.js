const express = require("express");
const router = express.Router();
const controller = require("../../../controllers/tasks.controller");

router.get("/", controller.index);
router.get("/:id", controller.detail);
router.patch("/changeStatus/:id", controller.changeStatus);
router.patch("/changeMulti", controller.changeMulti);
router.post("/create", controller.create);
router.patch("/edit/:id", controller.edit);
router.delete("/delete/:id", controller.deleteItem);

module.exports = router;
