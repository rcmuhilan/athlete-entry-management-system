import express from "express";
import multer from "multer";
import { studentsController } from "./students.controller.js";
import { authenticateUser, checkRole } from "../../common/middleware/auth.middleware.js";

const router = express.Router();

// Setup Multer to keep the file in memory
const upload = multer({ storage: multer.memoryStorage() });

// Admin only: upload students Excel
router.post("/import", authenticateUser, checkRole(["admin"]), (upload.single("file") as any), studentsController.importExcel.bind(studentsController));

// Admin only: download template
router.get("/template", authenticateUser, checkRole(["admin"]), studentsController.getTemplate.bind(studentsController));

// Get all students (Admin, Teacher, Coordinator can read)
router.get("/", authenticateUser, studentsController.getAll.bind(studentsController));

export default router;
