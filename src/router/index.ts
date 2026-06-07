import { Router as ExpressRouter } from "express";
import { AuthController } from "../auth/auth.controller";
import { AuthMiddleware } from "../auth/auth.middleware";
import { HealthController } from "../health/health.controller";
import { LoginRateLimit } from "../auth/rateLimit";
import { UserController } from "../user";

export class Router {
  private readonly router = ExpressRouter();

  constructor(
    private authController: AuthController,
    private healthController: HealthController,
    private authMiddleware: AuthMiddleware,
    private loginRateLimit: LoginRateLimit,
    private userController: UserController,
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

    this.router.get(
      "/user",
      this.userController.getUser.bind(this.userController),
    );
  }

  getRouter() {
    return this.router;
  }
}
