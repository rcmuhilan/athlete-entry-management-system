import express from "express";
import { eventsService } from "./events.service.js";
import { ApiResponseHelper } from "../../common/utils/apiResponse.js";

/**
 * Controller to handle Event operations.
 */
export class EventsController {

  public async getAll(req: express.Request, res: express.Response) {
    try {
      const data = await eventsService.getAll(req.query);
      ApiResponseHelper.success(res, "Events fetched successfully", data);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to fetch events", error);
    }
  }

  public async create(req: express.Request, res: express.Response) {
    try {
      const data = await eventsService.create(req.body);
      ApiResponseHelper.success(res, "Event created successfully", data, 201);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to create event", error);
    }
  }

  public async update(req: express.Request, res: express.Response) {
    try {
      const data = await eventsService.update(req.params.id, req.body);
      ApiResponseHelper.success(res, "Event updated successfully", data);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to update event", error);
    }
  }

  public async delete(req: express.Request, res: express.Response) {
    try {
      const result = await eventsService.delete(req.params.id);
      ApiResponseHelper.success(res, "Event deleted successfully", result);
    } catch (error: any) {
      ApiResponseHelper.error(res, "Failed to delete event", error);
    }
  }
}

export const eventsController = new EventsController();

