'use server'

import mongoose from "mongoose";

const url = process.env.MONGODB_URI;

if (!url) {
  throw new Error("MONGODB_URI environment variable is not defined");
}


export const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000, // Set server selection timeout (e.g., 5 seconds)
    });
    console.log("Database is connected");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit process with failure
  }


  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB connection disconnected");
  });
};
