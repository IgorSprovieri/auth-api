import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { Jwt } from "./jwt";
import { UserModel } from "../models/users";
import { AppError } from "../errors/appError";

export class AuthController {
  private readonly fakeHash =
    "$2b$12$QY9d3yM2DqL7rW4hR7jVPe7Q7mY1Nn2v6N5m5aQxM1uM8gA2tWz6K";

  constructor(
    private readonly jwt: Jwt,
    private readonly userModel: UserModel,
  ) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const userFound = await this.userModel.getModel().findOne({ email });

    if (userFound?.lockUntil && userFound.lockUntil > new Date()) {
      throw new AppError("Account temporarily locked", 429);
    }

    if (!userFound) {
      await bcrypt.compare(password, this.fakeHash);

      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (!isPasswordValid) {
      const attempts = (userFound.failedLoginAttempts ?? 0) + 1;

      let lockUntil: Date | null = null;

      if (attempts >= 5 && attempts < 10) {
        lockUntil = new Date(Date.now() + 5 * 60 * 1000);
      }

      if (attempts >= 10) {
        lockUntil = new Date(Date.now() + 30 * 60 * 1000);
      }

      await this.userModel.getModel().updateOne(
        { _id: userFound._id },
        {
          failedLoginAttempts: attempts,
          lockUntil,
        },
      );

      throw new AppError("Invalid credentials", 401);
    }

    await this.userModel.getModel().updateOne(
      { _id: userFound._id },
      {
        failedLoginAttempts: 0,
        lockUntil: null,
      },
    );

    const token = await this.jwt.signToken({ id: userFound._id });

    const userResponse = {
      name: userFound.name,
      email: userFound.email,
    };

    return res.json({ user: userResponse, token });
  }

  async getJwk(req: Request, res: Response) {
    return res.json(this.jwt.getPublicTokenJwk());
  }
}
