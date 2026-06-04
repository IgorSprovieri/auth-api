import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { Jwt } from "./jwt";
import { UserModel } from "../models/users";
import { AppError } from "../errors/appError";

export class AuthController {
  constructor(
    private jwt: Jwt,
    private userModel: UserModel,
  ) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const userFound = await this.userModel.getModel().findOne({ email });

    if (!userFound) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = await this.jwt.signToken({ id: userFound._id });

    const userResponse = {
      name: userFound.name,
      email: userFound.email,
    };

    return res.json({ user: userResponse, token });
  }
}
