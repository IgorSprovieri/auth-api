import { createClient, RedisClientType } from "redis";
import { Env } from "../env";

export class RedisDB {
  private redis: RedisClientType;

  constructor(private readonly env: Env) {
    this.redis = createClient({
      url: env.REDIS_DB_URL,
    });
  }

  async connect() {
    await this.redis.connect();
    console.log("RedisDB connected");
  }

  async sendCommand<Type>(args: string[]): Promise<Type> {
    return await this.redis.sendCommand(args);
  }

  isConnected() {
    return this.redis.isOpen;
  }
}
