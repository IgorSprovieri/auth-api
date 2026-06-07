import mongoose from "mongoose";
import { Env } from "../env";
import { logger } from "../logger";

const dbLogger = logger.child({ module: "mongodb" });

export class MongoDB {
  constructor(private readonly env: Env) {}

  async connect() {
    mongoose.connect(this.env.MONGO_DB_URL);
    dbLogger.info("connected");
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}
