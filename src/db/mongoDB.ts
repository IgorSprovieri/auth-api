import mongoose from "mongoose";
import { Env } from "../env";

export class MongoDB {
  constructor(private readonly env: Env) {}

  async connect() {
    mongoose.connect(this.env.MONGO_DB_URL);
    console.log("MongoDB connected");
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}
