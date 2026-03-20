import express from "express";
import { athletesService } from "./athletes.service.js";
import { ApiResponseHelper } from "../../common/utils/apiResponse.js";

/**
 * Controller to handle Athlete records management.
 */
export class AthletesController {
  
  public async getAll(req: express.Request, res: express.Response) {
    try {
      const data = await athletesService.getAll();
      ApiResponseHelper.success(res, "Athletes fetched successfully", data);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to fetch athletes", error);
    }
  }

  public async create(req: express.Request, res: express.Response) {
    try {
      const data = await athletesService.create(req.body, (req as any).user.id);
      ApiResponseHelper.success(res, "Athlete created successfully", data, 201);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to create athlete", error);
    }
  }

  public async update(req: express.Request, res: express.Response) {
    try {
      const data = await athletesService.update(req.params.id, req.body);
      ApiResponseHelper.success(res, "Athlete updated successfully", data);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to update athlete", error);
    }
  }

  public async delete(req: express.Request, res: express.Response) {
    try {
      const result = await athletesService.delete(req.params.id);
      ApiResponseHelper.success(res, "Athlete deleted successfully", result);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to delete athlete", error);
    }
  }
}

export const athletesController = new AthletesController();

