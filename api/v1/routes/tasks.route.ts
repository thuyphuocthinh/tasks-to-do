import * as express from "express";
import * as controller from "../../../controllers/tasks.controller";
const router: express.Router = express.Router();

router.get("/", controller.index);
router.get("/:id", controller.detail);
router.patch("/changeStatus/:id", controller.changeStatus);
router.patch("/changeMulti", controller.changeMulti);
router.post("/create", controller.create);
router.patch("/edit/:id", controller.edit);
router.delete("/delete/:id", controller.deleteItem);

export default router;