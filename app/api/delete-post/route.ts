import { NextRequest, NextResponse } from "next/server";
import { deletePost } from "@/Post/delete";
import * as jose from "jose";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!process.env.SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const secret = new TextEncoder().encode(process.env.SECRET);

    try {
      const verifiedToken = await jose.jwtVerify(token.value, secret, {
        algorithms: ["HS256"],
      });

      if (!verifiedToken.payload) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Call the delete function from the Post module
    const result = await deletePost(postId);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to delete post" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in delete-post API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
