import express from "express";
import passport from "passport";
import { authController } from "./auth.controller.js";

const router = express.Router();

/**
 * Authentication Routes.
 */
router.post("/signup", authController.signup.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/social/firebase", authController.socialLogin.bind(authController));
router.get("/profile", passport.authenticate("jwt", { session: false }), authController.getProfile.bind(authController));
router.post("/logout", authController.logout.bind(authController));

export default router;
