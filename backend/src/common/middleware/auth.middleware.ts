import passport from "passport";
import { ApiResponseHelper } from "../utils/apiResponse.js";

/**
 * Middleware to authenticate user using Passport JWT strategy.
 * This replaces the previous Supabase Auth check.
 */
export const authenticateUser = (req: any, res: any, next: any) => {
  passport.authenticate("jwt", { session: false }, (err: any, user: any, info: any) => {
    if (err || !user) {
      return ApiResponseHelper.unauthorized(res, info?.message || "Unauthorized: Your session has expired.");
    }
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Middleware to restrict access based on user role.
 * User must be authenticated first (by authenticateUser).
 */
export const checkRole = (roles: string[]) => (req: any, res: any, next: any) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return ApiResponseHelper.forbidden(res, "Forbidden: You do not have the required permissions.");
  }
  next();
};

