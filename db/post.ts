import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  category: string;
  status: "draft" | "published";
  likes: number;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

// Comment Subdocument Interface
export interface IComment {
  userId: mongoose.Types.ObjectId;
  comment: string;
  createdAt: Date;
}

// Post Schema
const PostSchema: Schema = new Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    category: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    likes: { type: Number, default: 0 },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const PostModel = mongoose.model<IPost>("Post", PostSchema);
