import express from "express";
import { studentsService } from "./students.service.js";
import { ApiResponseHelper } from "../../common/utils/apiResponse.js";

export class StudentsController {
  public async importExcel(req: express.Request, res: express.Response) {
    try {
      if (!req.file) {
        return ApiResponseHelper.error(res, "No file uploaded.");
      }
      const data = await studentsService.importFromExcel(req.file.buffer);
      ApiResponseHelper.success(res, "Import successful", data, 201);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Import failed", error.message);
    }
  }

  public async getAll(req: express.Request, res: express.Response) {
    try {
      const data = await studentsService.getAll();
      ApiResponseHelper.success(res, "Students fetched successfully", data);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to fetch students", error.message);
    }
  }

  public async getTemplate(req: express.Request, res: express.Response) {
    try {
      const buffer = await studentsService.getTemplate();
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=student_import_template.xlsx");
      res.send(buffer);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to download template", error.message);
    }
  }
}

export const studentsController = new StudentsController();
