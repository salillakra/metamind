import { connectDB } from "@/db/connect";
import { PostModel } from "@/db/post";
import { UserModel } from "@/db/user";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();
    const posts = await PostModel.find({ status: "published" });
    const postsWithAuthors = [];
    for (const post of posts) {
      const author = await UserModel.findById(post.authorId);
      postsWithAuthors.push({ post, author });
    }
    return NextResponse.json({ posts: postsWithAuthors });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch posts" });
  }
};
