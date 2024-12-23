"use server";

import { connectDB } from "@/db/connect";
import { PostModel } from "@/db/post";
import mongoose from "mongoose";

export const updateViews = async (_id: string) => {
  try {
    await connectDB();
    console.log("Updating views for post with ID:", _id);
    const res = await PostModel.updateOne({ _id: new mongoose.Types.ObjectId(_id) }, { $inc: { views: 1 } }).exec();
    console.log("Update operation result:", res);
    console.log("Views updated successfully:", res);
  } catch (error) {
    console.error("Error updating the views:", error);
  }
};
