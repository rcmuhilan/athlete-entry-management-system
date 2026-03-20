import express from "express";
import { registrationsService } from "./registrations.service.js";
import { ApiResponseHelper } from "../../common/utils/apiResponse.js";

/**
 * Controller to handle Registrations.
 */
export class RegistrationsController {

  public async getAll(req: express.Request, res: express.Response) {
    try {
      const data = await registrationsService.getAll(req.query);
      ApiResponseHelper.success(res, "Registrations fetched successfully", data);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to fetch registrations", error);
    }
  }

  public async create(req: express.Request, res: express.Response) {
    try {
      const data = await registrationsService.create(req.body);
      ApiResponseHelper.success(res, "Registration created successfully", data, 201);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to create registration", error);
    }
  }

  public async delete(req: express.Request, res: express.Response) {
    try {
      const result = await registrationsService.delete(req.params.id);
      ApiResponseHelper.success(res, "Registration deleted successfully", result);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to delete registration", error);
    }
  }
}

export const registrationsController = new RegistrationsController();

