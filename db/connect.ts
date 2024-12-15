"use server";
import mongoose from "mongoose";

const url = process.env.MONGODB_URI;
export const connectDB = async () => {
  try {
    await mongoose.connect(url!, {});
    console.log("Database is connected");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};
