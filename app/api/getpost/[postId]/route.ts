import { type NextRequest, NextResponse } from "next/server";
import { PostModel } from "@/db/post";
import { UserModel } from "@/db/user";
import { connectDB } from "@/db/connect"; // <-- Add this import

export const GET = async (
  req: NextRequest,
  context: { params: { postId: string } }
) => {
  // Destructure the postId from the context
  const { params } = context;

  try {
    await connectDB();

    const post = await PostModel.findById(params.postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const author = await UserModel.findById(post.authorId);
    return NextResponse.json({
      post: post,
      author: author,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
};
