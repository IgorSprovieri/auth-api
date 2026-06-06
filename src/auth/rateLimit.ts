import rateLimit from "express-rate-limit";
import { RedisDB } from "../db/redisDB";
import { RedisReply, RedisStore } from "rate-limit-redis";

export class LoginRateLimit {
  constructor(private readonly redisDB: RedisDB) {}

  getLoginRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,

      store: new RedisStore({
        sendCommand: (...args: string[]) =>
          this.redisDB.sendCommand<RedisReply>(args),
      }),
    });
  }
}
