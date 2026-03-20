import { Response } from "express";
import { LoggerInstance } from "../logging/logger.js";

const Logger = new LoggerInstance({ serviceName: "ApiResponse", filePath: "backend/src/common/utils/apiResponse.ts" });

/**
 * Standard API Response Structure.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

/**
 * Utility class to provide consistent responses across the API.
 */
export class ApiResponseHelper {
  /**
   * Sends a successful response.
   */
  static success<T>(res: Response, message: string, data?: T, statusCode: number = 200) {
    Logger.info(`[${statusCode}] SUCCESS: ${message}`);
    
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Sends an error response.
   */
  static error(res: Response, message: string, error?: any, statusCode: number = 500) {
    const errorDetail = error?.message || error || "";
    
    if (statusCode >= 500) {
      Logger.error(`[${statusCode}] ERROR: ${message} - ${errorDetail}`);
      if (error?.stack) {
        Logger.error(error.stack);
      }
    } else {
      Logger.warn(`[${statusCode}] WARNING: ${message} - ${errorDetail}`);
    }

    const response: ApiResponse = {
      success: false,
      message,
      error: error?.message || error || null,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Sends an unauthorized response.
   */
  static unauthorized(res: Response, message: string = "Unauthorized") {
    return this.error(res, message, null, 401);
  }

  /**
   * Sends a forbidden response.
   */
  static forbidden(res: Response, message: string = "Forbidden") {
    return this.error(res, message, null, 403);
  }

  /**
   * Sends a not found response.
   */
  static notFound(res: Response, message: string = "Resource not found") {
    return this.error(res, message, null, 404);
  }

  /**
   * Sends a bad request response.
   */
  static badRequest(res: Response, message: string = "Bad request", error?: any) {
    return this.error(res, message, error, 400);
  }
}
