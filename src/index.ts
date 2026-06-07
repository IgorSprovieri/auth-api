import express from "express";
import cors from "cors";
import { Env } from "./env";
import { Router } from "./router";
import { AuthController } from "./auth/auth.controller";
import { AuthMiddleware } from "./auth/auth.middleware";
import { MongoDB } from "./db/mongoDB";
import { UserModel } from "./models/users";
import { Jwt } from "./auth/jwt";
import { ErrorMiddleware } from "./errors/error.middleware";
import { HealthController } from "./health/health.controller";
import { LoginRateLimit } from "./auth/rateLimit";
import { RedisDB } from "./db/redisDB";
import { UserController } from "./user";

class Server {
  constructor(
    private readonly app: express.Application,
    private readonly router: Router,
    private readonly env: Env,
    private readonly mongoDB: MongoDB,
    private readonly redisDB: RedisDB,
    private readonly errorMiddleware: ErrorMiddleware,
  ) {
    app.use(express.json());
    app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );
  }

  async start() {
    await this.mongoDB.connect();
    await this.redisDB.connect();

    this.router.setup();
    this.app.use(this.router.getRouter());
    this.app.use(this.errorMiddleware.execute);

    this.app.listen(this.env.PORT, () => {
      console.log(`Server running on port ${this.env.PORT}`);
    });
  }
}

const app = express();
const env = new Env();
const jwt = new Jwt(env);

const mongoDB = new MongoDB(env);
const redisDB = new RedisDB(env);

const userModel = new UserModel();

const authController = new AuthController(jwt, userModel);
const authMiddleware = new AuthMiddleware(jwt);
const healthController = new HealthController(mongoDB, redisDB);
const loginRateLimit = new LoginRateLimit(redisDB);
const userController = new UserController(userModel);

const router = new Router(
  authController,
  healthController,
  authMiddleware,
  loginRateLimit,
  userController,
);

const errorMiddleware = new ErrorMiddleware();
const server = new Server(app, router, env, mongoDB, redisDB, errorMiddleware);

server.start();
