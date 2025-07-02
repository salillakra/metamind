"use server";

import prisma from "@/lib/prisma";

export const updateViews = async (_id: string) => {
  try {
    // Check if a PostStats entry exists for this post
    const existingStats = await prisma.postStats.findFirst({
      where: {
        postId: _id,
      },
    });

    if (existingStats) {
      // Update the existing stats by incrementing the views
      await prisma.postStats.update({
        where: {
          id: existingStats.id,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    } else {
      // Create a new PostStats entry for this post
      await prisma.postStats.create({
        data: {
          postId: _id,
          views: 1,
        },
      });
    }
  } catch (error) {
    console.error("Error updating the views:", error);
  }
};
