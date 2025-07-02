import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    // Get all posts
    const posts = await prisma.post.findMany({
      where: {
        isPublished: true,
      },
      select: {
        tags: true,
      },
    });

    // Flatten all tags and count occurrences
    const allTags = posts.flatMap((post) => post.tags);
    const tagCounts = allTags.reduce(
      (acc: Record<string, number>, tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      },
      {}
    );

    // Convert to array, sort by count (descending), and take top 10
    const trendingTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({ trendingTags });
  } catch (error) {
    console.error("Error fetching trending tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending tags" },
      { status: 500 }
    );
  }
};
