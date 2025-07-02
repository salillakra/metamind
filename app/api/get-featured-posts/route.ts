import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    // Fetch featured posts with their authors and stats
    const featuredPosts = await prisma.post.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },
      include: {
        author: true,
        PostStats: true,
      },
      take: 5, // Limit to 5 featured posts
    });

    // Transform the data to match the expected structure
    const formattedPosts = featuredPosts.map((post) => {
      const stats = post.PostStats[0] || { views: 0, likes: 0 };

      return {
        post: {
          _id: post.id,
          title: post.title,
          category: post.category || "General",
          imageURL: post.imageURL || "/default-image.jpg",
          tags: post.tags,
          description: post.description,
          createdAt: post.createdAt,
          likes: stats.likes,
          views: stats.views,
        },
        author: {
          profilePic: post.author.imageURL || "/default-image.jpg",
          firstName: post.author.firstName || "",
          lastName: post.author.lastName || "",
        },
      };
    });

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured posts" },
      { status: 500 }
    );
  }
};
