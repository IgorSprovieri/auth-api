import { AppError } from "../errors/appError";
import { Request, Response } from "express";
import { Database } from "../db";

export class HealthController {
  constructor(private database: Database) {}

  async check(req: Request, res: Response) {
    const dbConnected = this.database.isConnected();

    if (!dbConnected) {
      throw new AppError("db disconnected", 503);
    }

    return res.json({
      status: "healthy",
      database: "connected",
      uptime: process.uptime(),
    });
  }
}
