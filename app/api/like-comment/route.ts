import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as jose from "jose";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!process.env.SECRET) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const secret = new TextEncoder().encode(process.env.SECRET);

    try {
      await jose.jwtVerify(token.value, secret, {
        algorithms: ["HS256"],
      });
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Parse request body
    const { commentId } = await req.json();

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: "Comment ID is required" },
        { status: 400 }
      );
    }

    // Update the like count
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      likes: updatedComment.likes,
    });
  } catch (error: unknown) {
    console.error("Error liking comment:", error);

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
