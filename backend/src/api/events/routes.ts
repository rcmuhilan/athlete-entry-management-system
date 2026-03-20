import express from "express";
import { eventsController } from "./events.controller.js";
import { authenticateUser, checkRole } from "../../common/middleware/auth.middleware.js";

const router = express.Router();

/**
 * Event Management Routes.
 */
router.get("/", eventsController.getAll.bind(eventsController));
router.post("/", authenticateUser, checkRole(["admin"]), eventsController.create.bind(eventsController));
router.put("/:id", authenticateUser, checkRole(["admin"]), eventsController.update.bind(eventsController));
router.delete("/:id", authenticateUser, checkRole(["admin"]), eventsController.delete.bind(eventsController));

export default router;
