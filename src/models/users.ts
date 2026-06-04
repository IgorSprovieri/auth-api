import { Schema, model } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  reset_password_token: string | null;
  reset_password_created_at: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  private userSchema = new Schema<IUser>({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    reset_password_token: {
      type: String,
      default: null,
    },
    reset_password_created_at: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });

  getModel() {
    return model<IUser>("users", this.userSchema);
  }
}
