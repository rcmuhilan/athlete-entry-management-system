import express from "express";
import { athletesController } from "./athletes.controller.js";
import { authenticateUser, checkRole } from "../../common/middleware/auth.middleware.js";

const router = express.Router();

/**
 * Athlete Records Management Routes.
 */
router.get("/", athletesController.getAll.bind(athletesController));
router.post("/", authenticateUser, checkRole(["admin", "teacher"]), athletesController.create.bind(athletesController));
router.put("/:id", authenticateUser, checkRole(["admin", "teacher"]), athletesController.update.bind(athletesController));
router.delete("/:id", authenticateUser, checkRole(["admin"]), athletesController.delete.bind(athletesController));

export default router;
