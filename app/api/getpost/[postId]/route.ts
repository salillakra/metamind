import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) => {
  const { postId } = await params;

  try {
    // Fetch the post with its author using Prisma
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Transform the data to match the expected structure in the frontend
    const transformedPost = {
      _id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      tags: post.tags,
      isPublished: post.isPublished,
      category: post.category,
      imageURL: post.imageURL,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    const transformedAuthor = post.author
      ? {
          _id: post.author.id,
          username: post.author.username,
          email: post.author.email,
          firstName: post.author.firstName,
          lastName: post.author.lastName,
          imageURL: post.author.imageURL,
        }
      : null;

    return NextResponse.json({
      post: transformedPost,
      author: transformedAuthor,
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
