import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (
  req: NextRequest,
  context: { params: { postId: string } }
) => {
  const { params } = context;

  try {
    // Fetch the comments stats using Prisma
    const comments = await prisma.comment.findMany({
      where: {
        postId: params.postId,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            imageURL: true,
          },
        },
      },
    });

    // If no comments exist yet, return an empty array
    if (!comments) {
      return NextResponse.json({
        success: true,
        comments: [],
      });
    }

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await prisma.commentReply.findMany({
          where: {
            commentId: comment.id,
          },
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                imageURL: true,
              },
            },
          },
        });
        return { replies, ...comment };
      })
    );

    return NextResponse.json({
      success: true,
      comments: commentsWithReplies,
    });
  } catch (error: unknown) {
    console.error("Error in GET post stats:", error);

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
