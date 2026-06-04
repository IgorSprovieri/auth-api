import { Schema, model } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
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
  });

  getModel() {
    return model<IUser>("users", this.userSchema);
  }
}
