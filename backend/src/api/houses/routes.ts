import express from "express";
import { housesController } from "./houses.controller.js";
import { authenticateUser, checkRole } from "../../common/middleware/auth.middleware.js";

const router = express.Router();

// Allow public/viewers to get houses
router.get("/", housesController.getAll.bind(housesController));

// Admin only routes
router.post("/", authenticateUser, checkRole(["admin"]), housesController.create.bind(housesController));
router.put("/:id", authenticateUser, checkRole(["admin"]), housesController.update.bind(housesController));
router.delete("/:id", authenticateUser, checkRole(["admin"]), housesController.delete.bind(housesController));

export default router;
