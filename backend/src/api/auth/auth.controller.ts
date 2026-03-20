import express from "express";
import passport from "passport";
import { authService } from "./auth.service.js";
import { ApiResponseHelper } from "../../common/utils/apiResponse.js";
import "./passport.config.js";
import { LoggerInstance } from "../../common/logging/logger.js";

const Logger = new LoggerInstance({ serviceName: "AuthController", filePath: "backend/src/api/auth/auth.controller.ts" });

/**
 * Controller to handle authentication.
 * Contains only the logic for handling request/response.
 */
export class AuthController {

  public async signup(req: express.Request, res: express.Response) {
    try {
      const { email, password, full_name, role } = req.body;
      const user = await authService.signup(email, password, full_name, role);
      ApiResponseHelper.success(res, "User registered successfully.", { user }, 201);
    } catch (error: any) {
      Logger.error(`Signup failed: ${error.message}`);
      ApiResponseHelper.badRequest(res, error.message);
    }
  }

  public login(req: express.Request, res: express.Response, next: express.NextFunction) {
    passport.authenticate("local", { session: false }, (err: any, user: any, info: any) => {
      if (err || !user) {
        Logger.warn(`Login attempt failed: ${info?.message || "Invalid credentials"}`);
        return ApiResponseHelper.badRequest(res, info?.message || "Login failed.");
      }

      const token = authService.generateToken(user);

      res.cookie("jwt_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, 
      });

      ApiResponseHelper.success(res, "Logged in successfully.", { user, token });
    })(req, res, next);
  }

  public async socialLogin(req: express.Request, res: express.Response) {
    try {
      const { idToken } = req.body;
      if (!idToken) return ApiResponseHelper.badRequest(res, "Missing Firebase ID Token.");

      const { user, token } = await authService.firebaseSocialLogin(idToken);

      res.cookie("jwt_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });

      ApiResponseHelper.success(res, "Social login successful.", { user, token });
    } catch (err: any) {
      ApiResponseHelper.badRequest(res, err.message);
    }
  }

  public getProfile(req: express.Request, res: express.Response) {
    ApiResponseHelper.success(res, "Profile fetched successfully", { user: req.user });
  }

  public logout(req: express.Request, res: express.Response) {
    res.clearCookie("jwt_token");
    ApiResponseHelper.success(res, "Logged out successfully.");
  }
}

export const authController = new AuthController();

