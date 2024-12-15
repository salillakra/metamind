import mongoose, { Schema, Document } from "mongoose";

// User Interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "author" | "reader" | "admin";
  bio?: string;
  profilePic?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["author", "reader", "admin"],
      default: "reader",
    },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);

// Check if the model already exists
const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export { UserModel };
