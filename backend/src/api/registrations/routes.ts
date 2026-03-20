import express from "express";
import { registrationsController } from "./registrations.controller.js";
import { authenticateUser, checkRole } from "../../common/middleware/auth.middleware.js";

const router = express.Router();

/**
 * Registrations Management Routes.
 */
router.get("/", registrationsController.getAll.bind(registrationsController));
router.post("/", authenticateUser, checkRole(["admin", "teacher"]), registrationsController.create.bind(registrationsController));
router.delete("/:id", authenticateUser, checkRole(["admin", "teacher"]), registrationsController.delete.bind(registrationsController));

export default router;
