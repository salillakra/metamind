import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (
  req: NextRequest,
  context: { params: { postId: string } }
) => {
  const params = context.params;

  try {
    // Fetch the post stats using Prisma
    const stats = await prisma.postStats.findFirst({
      where: {
        postId: params.postId,
      },
    });

    // If no stats exist yet, return zeros
    if (!stats) {
      return NextResponse.json({
        success: true,
        stats: {
          views: 0,
          likes: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        views: stats.views,
        likes: stats.likes,
      },
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
