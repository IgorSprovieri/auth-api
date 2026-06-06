import { Router as ExpressRouter } from "express";
import { AuthController } from "../auth/auth.controller";
import { AuthMiddleware } from "../auth/auth.middleware";
import { HealthController } from "../health/health.controller";
import { LoginRateLimit } from "../auth/rateLimit";

export class Router {
  private readonly router = ExpressRouter();

  constructor(
    private authController: AuthController,
    private healthController: HealthController,
    private authMiddleware: AuthMiddleware,
    private loginRateLimit: LoginRateLimit,
  ) {}

  setup() {
    this.router.post(
      "/login",
      this.loginRateLimit.getLoginRateLimit(),
      this.authController.login.bind(this.authController),
    );

    this.router.get(
      "/health",
      this.healthController.check.bind(this.healthController),
    );

    this.router.get(
      "/.well-known/jwks.json",
      this.authController.getJwk.bind(this.authController),
    );

    this.router.use(this.authMiddleware.execute.bind(this.authMiddleware));
  }

  getRouter() {
    return this.router;
  }
}
