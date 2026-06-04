import "dotenv/config";

export class Env {
  PORT: number;
  DB_URL: string;
  JWT_SECRET: string;

  constructor() {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL is not set in .env file");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in .env file");
    }

    this.PORT = Number(process.env.PORT) || 3333;
    this.DB_URL = process.env.DB_URL;
    this.JWT_SECRET = process.env.JWT_SECRET;
  }
}
