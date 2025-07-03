import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    // Fetch all published posts with their authors and stats
    const posts = await prisma.post.findMany({
      where: {
        isPublished: true,
      },
      include: {
        author: true,
        PostStats: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // Limit to 20 posts for better performance
    });

    // Transform the data to match the expected structure
    const postsWithAuthors = posts.map((post) => {
      const stats = post.PostStats[0] || { views: 0, likes: 0 };

      return {
        post: {
          _id: post.id,
          title: post.title,
          description: post.description,
          tags: post.tags,
          category: post.category || "General",
          imageURL: post.imageURL || "https://avatar.iran.liara.run/public",
          createdAt: post.createdAt,
          views: stats.views,
          likes: stats.likes,
        },
        author: {
          profilePic:
            post.author?.imageURL || "https://avatar.iran.liara.run/public",
          firstName: post.author?.firstName || "",
          lastName: post.author?.lastName || "",
        },
      };
    });

    return NextResponse.json({ posts: postsWithAuthors });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
};
