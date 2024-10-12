import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  coverUrl?: string;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: [true, "Email exist"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      unique: false,
      minLength: [8, "Password must be up to 8 characters"],
    },
    fullName: {
      type: String,
      required: [true, "Please enter full name"],
      unique: false,
    },
    coverUrl: { type: String },
    isAdmin: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
