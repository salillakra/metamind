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

    let userData;
    try {
      const verified = await jose.jwtVerify(token.value, secret, {
        algorithms: ["HS256"],
      });
      userData = verified.payload;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Parse request body
    const { content, commentId } = await req.json();

    if (!content || !commentId) {
      return NextResponse.json(
        { success: false, error: "Reply content and commentId are required" },
        { status: 400 }
      );
    }

    // Create the comment reply
    const newReply = await prisma.commentReply.create({
      data: {
        content,
        commentId,
        authorId: userData.id as string,
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

    return NextResponse.json({
      success: true,
      reply: newReply,
    });
  } catch (error: unknown) {
    console.error("Error creating comment reply:", error);

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
