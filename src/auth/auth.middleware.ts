import { Request, Response, NextFunction } from "express";
import { Jwt } from "./jwt";
import { AppError } from "../errors/appError";

export class AuthMiddleware {
  constructor(private readonly jwt: Jwt) {}

  async execute(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header) {
      throw new AppError("No token", 401);
    }

    const token = header.split(" ")[1];

    try {
      const decoded = await this.jwt.verifyToken(token);
      (req as any).user = decoded;
      next();
    } catch {
      throw new AppError("Invalid token", 403);
    }
  }
}
