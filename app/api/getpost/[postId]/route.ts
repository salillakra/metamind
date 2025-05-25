import { type NextRequest, NextResponse } from "next/server";
import { PostModel } from "@/db/post";
import { UserModel } from "@/db/user";
import { connectDB } from "@/db/connect";

interface Post {
  _id: string;
  authorId: string;
  // add other fields as needed, e.g. title: string; content: string;
}

export const GET = async (
  req: NextRequest,
  context: { params: { postId: string } }
) => {
  const { params } = context;

  try {
    await connectDB();

    // Fetch the post as a plain JS object
    const post = (await PostModel.findById(
      params.postId
    ).lean()) as Post | null;
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Fetch the author as a plain JS object
    const author = await UserModel.findById(post.authorId).lean();

    return NextResponse.json({
      post,
      author,
    });
  } catch (error: unknown) {
    console.error("Error in GET post:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "An unknown error occurred" },
      { status: 500 }
    );
  }
};
