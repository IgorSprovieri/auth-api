import { Router as ExpressRouter } from "express";
import { AuthController } from "../auth/auth.controller";
import { AuthMiddleware } from "../auth/auth.middleware";
import { HealthController } from "../health/health.controller";

export class Router {
  private router = ExpressRouter();

  constructor(
    private authController: AuthController,
    private healthController: HealthController,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router.post("/login", this.authController.login);
    this.router.get("/health", this.healthController.check);

    this.router.use(this.authMiddleware.execute);
  }

  getRouter() {
    return this.router;
  }
}
