import { connectDB } from "@/db/connect";
import { PostModel } from "@/db/post";
import { UserModel } from "@/db/user";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();

    // Fetch all published posts as plain JS objects
    const posts = await PostModel.find({ status: "published" }).lean();

    // Get unique author IDs
    const authorIds = Array.from(new Set(posts.map((post) => post.authorId?.toString())));

    // Fetch all authors in a single query
    const authors = await UserModel.find({ _id: { $in: authorIds } }).lean();

    // Create a lookup for authors by _id
    const authorMap = new Map(
      authors.map((author) => [String(author._id), author])
    );

    // Combine posts with corresponding authors
    const postsWithAuthors = posts.map((post) => ({
      post,
      author: authorMap.get(post.authorId?.toString()) || null,
    }));

    return NextResponse.json({ posts: postsWithAuthors });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
};
