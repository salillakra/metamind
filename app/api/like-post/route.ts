"use server";

import { toggleLike } from "@/Post/LikePost";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, userId } = body;

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Post ID is required" },
        { status: 400 }
      );
    }

    const result = await toggleLike(postId, userId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing like:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process like" },
      { status: 500 }
    );
  }
}
