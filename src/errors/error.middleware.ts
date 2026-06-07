import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";
import { logger } from "../logger";

export class ErrorMiddleware {
  async execute(err: unknown, req: Request, res: Response, next: NextFunction) {
    const log = req.log ?? logger;

    if (err instanceof AppError) {
      log.warn({ statusCode: err.statusCode, err }, err.message);

      return res.status(err.statusCode).json({
        message: err.message,
      });
    }

    log.error({ err }, "Unexpected error");

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
