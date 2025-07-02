import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Delete related comments first to avoid foreign key constraints
    await prisma.commentReply.deleteMany({
      where: {
        comment: {
          postId: postId,
        },
      },
    });

    await prisma.comment.deleteMany({
      where: {
        postId: postId,
      },
    });

    // Delete post stats
    await prisma.postStats.deleteMany({
      where: {
        postId: postId,
      },
    });

    // Delete the post
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
