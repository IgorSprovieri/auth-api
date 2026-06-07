import { Schema, model } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  failedLoginAttempts: number;
  lockUntil: Date | null;
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
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  });

  getModel() {
    return model<IUser>("users", this.userSchema);
  }
}
