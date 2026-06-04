import rateLimit from "express-rate-limit";

export class LoginRateLimit {
  getLoginRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,

      message: {
        message: "Too many login attempts",
      },
    });
  }
}
