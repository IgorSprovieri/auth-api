import jwt from "jsonwebtoken";
import { createPublicKey } from "crypto";
import { Env } from "../env";
import fs from "fs";
import path from "path";

export interface JwtPayload {
  id: string;
}

export class Jwt {
  private privateKey: Buffer;
  private publicKey: Buffer;

  constructor(private readonly env: Env) {
    const keysDir = path.join(__dirname, "../../keys");
    this.privateKey = fs.readFileSync(path.join(keysDir, "private.key"));
    this.publicKey = fs.readFileSync(path.join(keysDir, "public.key"));
  }

  async signToken<Payload extends object>(payload: Payload) {
    return jwt.sign(payload, this.privateKey, {
      expiresIn: "1h",
      algorithm: "RS256",
    });
  }

  async verifyToken(token: string) {
    return jwt.verify(token, this.publicKey, {
      algorithms: ["RS256"],
    });
  }

  getPublicTokenJwk() {
    const keyObject = createPublicKey(this.publicKey);
    const jwk = keyObject.export({ format: "jwk" });

    return {
      kty: jwk.kty,
      n: jwk.n,
      e: jwk.e,
    };
  }
}
