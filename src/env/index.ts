import "dotenv/config";

export type EnvType = {
  PORT: number;
  MONGO_DB_URL: string;
  REDIS_DB_URL: string;
};

export class Env {
  PORT!: number;
  MONGO_DB_URL!: string;
  REDIS_DB_URL!: string;

  constructor() {
    const defaultValues = {
      PORT: 3333,
    };

    Object.keys(this).forEach((k) => {
      const key = k as keyof typeof defaultValues;

      if (!process.env[key] && !defaultValues[key]) {
        throw new Error(`${key} is not set in .env file`);
      }

      (this as Record<keyof EnvType, string | number>)[key] =
        process.env[key] || defaultValues[key];
    });
  }
}
