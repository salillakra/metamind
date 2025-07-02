import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const author = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: author.id,
        isPublished: true, // Only return published posts
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        PostStats: true,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching author posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
