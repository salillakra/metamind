import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as jose from "jose";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
  try {
    // Check authentication
    const cookieStore = cookies();
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
    const { replyId } = await req.json();

    if (!replyId) {
      return NextResponse.json(
        { success: false, error: "Reply ID is required" },
        { status: 400 }
      );
    }

    // Update the like count
    const updatedReply = await prisma.commentReply.update({
      where: {
        id: replyId,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      likes: updatedReply.likes,
    });
  } catch (error: unknown) {
    console.error("Error liking reply:", error);

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
