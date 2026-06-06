import { AppError } from "../errors/appError";
import { Request, Response } from "express";
import { MongoDB } from "../db/mongoDB";
import { RedisDB } from "../db/redisDB";

export class HealthController {
  constructor(
    private readonly mongoDB: MongoDB,
    private readonly redisDB: RedisDB,
  ) {}

  async check(req: Request, res: Response) {
    const isConnectedDbs = await Promise.all([
      this.mongoDB.isConnected(),
      this.redisDB.isConnected(),
    ]);

    const dbsName = ["MongoDB", "RedisDB"];
    const dbsDisconected: string[] = [];

    isConnectedDbs.forEach((isConnected, index) => {
      if (!isConnected) {
        dbsDisconected.push(dbsName[index]);
      }
    });

    if (dbsDisconected.length > 0) {
      throw new AppError(
        `Database disconnected: ${dbsDisconected.join(", ")}`,
        503,
      );
    }

    return res.json({
      status: "healthy",
      mongoDB: "connected",
      redisDB: "connected",
      uptime: process.uptime(),
    });
  }
}
