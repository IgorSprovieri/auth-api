import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";

export class ErrorMiddleware {
  async execute(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        message: err.message,
      });
    }

    console.error("Unexpected error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
