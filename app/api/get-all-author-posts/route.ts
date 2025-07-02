import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { authorId } = await request.json();

    if (!authorId) {
      return NextResponse.json(
        { error: "Author ID is required" },
        { status: 400 }
      );
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: authorId,
      },
      include: {
        PostStats: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedPosts = posts.map((post) => {
      const stats = post.PostStats[0] || { views: 0, likes: 0 };

      return {
        id: post.id,
        title: post.title,
        description: post.description,
        content: post.content,
        category: post.category,
        imageURL: post.imageURL,
        tags: post.tags,
        isPublished: post.isPublished,
        isFeatured: post.isFeatured,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        stats: {
          views: stats.views,
          likes: stats.likes,
        },
      };
    });

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error("Error fetching author posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
