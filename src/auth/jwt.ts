import jwt from "jsonwebtoken";
import { Env } from "../env";

export interface JwtPayload {
  id: string;
}

export class Jwt {
  constructor(private env: Env) {}

  async signToken(payload: object) {
    return jwt.sign(payload, this.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }

  async verifyToken(token: string) {
    return jwt.verify(token, this.env.JWT_SECRET);
  }
}
