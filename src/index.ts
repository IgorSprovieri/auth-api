import express from "express";
import cors from "cors";
import { Env } from "./env";
import { Router } from "./router";
import { AuthController } from "./auth/auth.controller";
import { AuthMiddleware } from "./auth/auth.middleware";
import { Database } from "./db";
import { UserModel } from "./models/users";
import { Jwt } from "./auth/jwt";
import { ErrorMiddleware } from "./errors/error.middleware";
import { HealthController } from "./health/health.controller";
import { LoginRateLimit } from "./auth/rateLimit";

class Server {
  constructor(
    private app: express.Application,
    private router: Router,
    private env: Env,
    private database: Database,
    private errorMiddleware: ErrorMiddleware,
  ) {
    app.use(express.json());
    app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );

    app.use(this.router.getRouter());
    app.use(this.errorMiddleware.execute);
  }

  async start() {
    await this.database.connect();

    this.app.listen(this.env.PORT, () => {
      console.log(`Server running on http://localhost:${this.env.PORT}`);
    });
  }
}

const app = express();
const env = new Env();
const jwt = new Jwt(env);

const database = new Database(env);
const userModel = new UserModel();

const authController = new AuthController(jwt, userModel);
const authMiddleware = new AuthMiddleware(jwt);
const healthController = new HealthController(database);
const loginRateLimit = new LoginRateLimit();

const router = new Router(
  authController,
  healthController,
  authMiddleware,
  loginRateLimit,
);

const errorMiddleware = new ErrorMiddleware();
const server = new Server(app, router, env, database, errorMiddleware);

server.start();
