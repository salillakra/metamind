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

    let userData;
    try {
      const verified = await jose.jwtVerify(token.value, secret, {
        algorithms: ["HS256"],
      });
      userData = verified.payload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Parse request body
    const { content, postId } = await req.json();

    if (!content || !postId) {
      return NextResponse.json(
        { success: false, error: "Comment content and postId are required" },
        { status: 400 }
      );
    }

    // Create the comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
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
      comment: newComment,
    });
  } catch (error: unknown) {
    console.error("Error creating comment:", error);

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
