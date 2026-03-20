import express from "express";
import { housesService } from "./houses.service.js";
import { ApiResponseHelper } from "../../common/utils/apiResponse.js";

export class HousesController {
  
  public async getAll(req: express.Request, res: express.Response) {
    try {
      const data = await housesService.getAll();
      ApiResponseHelper.success(res, "Houses fetched successfully", data);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to fetch houses", error);
    }
  }

  public async create(req: express.Request, res: express.Response) {
    try {
      const data = await housesService.create(req.body);
      ApiResponseHelper.success(res, "House created successfully", data, 201);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to create house", error);
    }
  }

  public async update(req: express.Request, res: express.Response) {
    try {
      const data = await housesService.update(req.params.id, req.body);
      ApiResponseHelper.success(res, "House updated successfully", data);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to update house", error);
    }
  }

  public async delete(req: express.Request, res: express.Response) {
    try {
      const result = await housesService.delete(req.params.id);
      ApiResponseHelper.success(res, "House deleted successfully", result);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to delete house", error);
    }
  }
}

export const housesController = new HousesController();
