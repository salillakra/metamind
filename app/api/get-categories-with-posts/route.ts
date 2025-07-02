import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    // Get all distinct categories
    const categoriesResult = await prisma.post.findMany({
      where: {
        isPublished: true,
        category: {
          not: null,
        },
      },
      distinct: ["category"],
      select: {
        category: true,
      },
    });

    const categories = categoriesResult
      .map((item) => item.category)
      .filter(
        (category): category is string => category !== null && category !== ""
      );

    // For each category, get the latest 4 posts
    const categoryPosts = await Promise.all(
      categories.map(async (category) => {
        const posts = await prisma.post.findMany({
          where: {
            isPublished: true,
            category,
          },
          include: {
            author: true,
            PostStats: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 4,
        });

        const formattedPosts = posts.map((post) => {
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
              profilePic: post.author?.imageURL || "/default-image.jpg",
              firstName: post.author?.firstName || "",
              lastName: post.author?.lastName || "",
            },
          };
        });

        return {
          category,
          posts: formattedPosts,
        };
      })
    );

    // Filter out categories with no posts
    const validCategoryPosts = categoryPosts.filter(
      (category) => category.posts.length > 0
    );

    return NextResponse.json({ categories: validCategoryPosts });
  } catch (error) {
    console.error("Error fetching categories with posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories with posts" },
      { status: 500 }
    );
  }
};
