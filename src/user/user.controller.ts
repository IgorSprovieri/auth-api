import { Request, Response } from "express";
import { UserModel } from "./user.model";
import { AppError } from "../errors/appError";

export class UserController {
  constructor(private readonly userModel: UserModel) {}

  async getUser(req: Request, res: Response) {
    const user = await this.userModel.getModel().findById(req.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return res.json({
      name: user.name,
      email: user.email,
    });
  }
}
