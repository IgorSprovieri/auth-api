import mongoose from "mongoose";
import { Env } from "../env";

export class Database {
  constructor(private env: Env) {}

  async connect() {
    mongoose.connect(this.env.DB_URL);
    console.log("MongoDB connected");
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}
